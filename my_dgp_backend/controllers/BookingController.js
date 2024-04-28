const Booking = require("../models/BookingModel");
const BookingRequest = require("../models/BookingRequestsModel");
const User = require("../models/UserModel");
const Redeem = require("../models/RedeemModel");
const Address = require("../models/AddressModel");

const catchAsyncErrors = require("../middleware/CatchAsyncErrors");
const { getAvailableServiceProviders } = require("../helpers/UserHelpers");
const Enums = require("../utils/Enums");
const ErrorHandler = require("../utils/errorHandler");
const {
  sendRiderPushNotifications,
  sendEmail,
} = require("../helpers/Notifications");
const {
  BOOKING_START,
  BOOKING_COMPLETE,
  NEW_RIDER_BOOKING,
} = require("../Data/Messages");

// create a booking
exports.createBooking = catchAsyncErrors(async (req, res, next) => {
  const {
    customer,
    address,
    coordinates,
    paymentInfo,
    coupon,
    couponDiscount,
    service,
    subService,
    package,
    hours,
    date,
    itemsPrice,
    taxPrice,
    totalPrice,
  } = req.body;

  // get all available Service Providers
  let allServiceProviders = await getAvailableServiceProviders(
    date,
    service,
    subService,
    package
  );
  if (allServiceProviders.length === 0) {
    return next(
      new ErrorHandler(
        "No service provider is available on the selected date. Please select a new date",
        400
      )
    );
  }

  // TODO- remove this as it is temporary for Phase - I
  // creating address as we get address not id
  const newAddress = await Address.create({
    address,
    coordinates,
    name: req.user.name,
    contactNumber: req.user.contactNumber,
    user: req.user,
  });

  // create a booking
  const booking = await Booking.create({
    customer,
    address: newAddress,
    paymentInfo,
    itemsPrice,
    taxPrice,
    hours,
    service,
    subService,
    package,
    date,
    totalPrice,
    coupon,
    couponDiscount,
    paidAt: Date.now(),
  });

  const service_providers = await User.find({
    _id: allServiceProviders,
  }).select("_id fcm_token");

  // create a request in BookingRequest table
  await BookingRequest.create({
    customer,
    booking: booking._id,
    serviceProviders: service_providers.map((item) => item.id),
    address: newAddress,
    service,
  });

  // sending push notification to riders device for a new booking
  sendRiderPushNotifications(
    service_providers.map((item) => item.fcm_token),
    NEW_RIDER_BOOKING
  );

  res.status(201).json({
    success: true,
    booking,
  });
});

// update status of booking - to be done by the service_provider
exports.updateBookingStatus = catchAsyncErrors(async (req, res, next) => {
  let booking = await Booking.findOne({
      _id: req.params.id,
      serviceProvider: req.user._id,
    }).select("+otp"),
    newStatus = req.body.status,
    otp = req.body.otp;

  if (!booking) {
    return next(new ErrorHandler("No such booking exists!", 404));
  }
  let currentStatus = booking.status;

  // Validations
  if (currentStatus === Enums.BOOKING_STATUS.CLOSED) {
    return next(new ErrorHandler(`Booking Already Closed!`, 400));
  } else if (
    newStatus !== Enums.BOOKING_STATUS.ONGOING &&
    newStatus !== Enums.BOOKING_STATUS.CLOSED
  ) {
    return next(new ErrorHandler("Invalid Status!", 400));
  }

  // Update the booking
  if (
    (currentStatus === Enums.BOOKING_STATUS.ACCEPTED &&
      newStatus === Enums.BOOKING_STATUS.ONGOING) ||
    (currentStatus === Enums.BOOKING_STATUS.ONGOING &&
      newStatus === Enums.BOOKING_STATUS.CLOSED)
  ) {
    if (newStatus === Enums.BOOKING_STATUS.ONGOING) {
      if (!otp) {
        return next(
          new ErrorHandler("OTP is required to start the booking", 400)
        );
      } else if (booking.otp !== otp) {
        return next(new ErrorHandler("Invalid OTP", 400)); // verify that the OTP is matching
      }
    }

    booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status: newStatus },
      { new: true, runValidators: true, useFindAndModify: false }
    ).populate("customer");

    // triggering email
    if (newStatus === Enums.BOOKING_STATUS.ONGOING) {
      sendEmail([booking.customer.email], "Booking Started", BOOKING_START);
    } else if (newStatus === Enums.BOOKING_STATUS.CLOSED) {
      sendEmail(
        [booking.customer.email],
        "Booking Completed",
        BOOKING_COMPLETE
      );
    }

    // updating rider amount for redemption
    if (newStatus === Enums.BOOKING_STATUS.CLOSED) {
      // Updating total Earnings on the User
      let totalEarnings = (req.user.totalEarnings || 0) + booking.totalPrice;
      await User.findByIdAndUpdate(
        req.user._id,
        { totalEarnings },
        { new: true, runValidators: true, useFindAndModify: false }
      );

      // updating the amount in Redeem model
      await Redeem.findOneAndUpdate(
        { serviceProvider: req.user._id },
        { $inc: { amountToBeRedeemed: 10 } },
        { new: true }
      ); // TODO - update the logic to add the amount
    }
  } else {
    return next(
      new ErrorHandler(
        "Cannot perform this operation for the current status!",
        400
      )
    );
  }

  res.status(200).json({
    success: true,
    message: "Booking Status Updated",
  });
});

// fetch all completed bookings of a user
exports.getCompletedBookingsOfAUser = catchAsyncErrors(
  async (req, res, next) => {
    let bookings = await Booking.find({
      serviceProvider: req.user._id,
      status: Enums.BOOKING_STATUS.CLOSED,
    })
      .sort("date")
      .populate("customer address");

    res.status(200).json({
      success: true,
      bookings,
      bookingsCount: bookings.length,
    });
  }
);

// fetch all current bookings of a user
exports.getCurrentBookingsOfAUser = catchAsyncErrors(async (req, res, next) => {
  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);
  const nextDay = new Date(currentDate);
  nextDay.setDate(currentDate.getDate() + 1);

  let bookings = await Booking.find({
    serviceProvider: req.user._id,
    date: {
      $gte: currentDate,
      $lt: nextDay,
    },
    status: { $ne: Enums.BOOKING_STATUS.CLOSED },
  }).populate("customer address");

  res.status(200).json({
    success: true,
    bookings,
    bookingsCount: bookings.length,
  });
});

// fetch all future bookings of a user
exports.getFutureBookingsOfAUser = catchAsyncErrors(async (req, res, next) => {
  const today = new Date();
  let bookings = await Booking.find({
    serviceProvider: req.user._id,
    date: { $gte: today },
    status: { $ne: Enums.BOOKING_STATUS.CLOSED },
  })
    .sort("date")
    .populate("customer address");

  res.status(200).json({
    success: true,
    bookings,
    bookingsCount: bookings.length,
  });
});

// Called from search rider screen to get booking status. If booking is accepted, then get service provider details as well.
exports.confirmBookingStatus = catchAsyncErrors(async (req, res, next) => {
  let booking = await Booking.findOne({ _id: req.params.id }).select("+otp");
  if (!booking) {
    return next(new ErrorHandler("No such booking found", 400));
  }
  let status = booking.status;
  let service_provider = null;

  if (booking.status === Enums.BOOKING_STATUS.ACCEPTED) {
    service_provider = await User.findOne({ _id: booking.serviceProvider });
  }

  return res.status(200).json({
    success: true,
    message: "Status fetched",
    status,
    booking,
    service_provider,
  });
});
