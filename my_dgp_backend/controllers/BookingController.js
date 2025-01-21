const Razorpay = require("razorpay");
const { v4: uuidv4 } = require("uuid");
const crypto = require("crypto");

const Booking = require("../models/BookingModel");
const BookingRequest = require("../models/BookingRequestsModel");
const User = require("../models/UserModel");
const Redeem = require("../models/RedeemModel");
const Address = require("../models/AddressModel");
const Price = require("../models/PriceModel");

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
const { updateBookingPayment } = require("../utils/bookingUtils");
const { sendWhatsAppBalanceMessage } = require("../utils/whatsappMsgs");

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
    email,
    minutes,
  } = req.body;

  // get all available Service Providers
  let allServiceProviders = await getAvailableServiceProviders(
    date,
    service,
    subService,
    package,
    coordinates
  );
  if (allServiceProviders.length === 0) {
    return next(
      new ErrorHandler(
        "No service provider is available right now. Please try again later.",
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
    email,
  });

  // create a booking
  const booking = await Booking.create({
    customer,
    address: newAddress,
    paymentInfo,
    itemsPrice,
    taxPrice,
    hours,
    minutes,
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
    { otp, photoNumber } = req.body;

  if (!booking) {
    return next(new ErrorHandler("No such booking exists!", 404));
  }
  let currentStatus = booking.status;

  // Validations
  if (
    newStatus !== Enums.BOOKING_STATUS.ONGOING &&
    newStatus !== Enums.BOOKING_STATUS.CLOSED &&
    newStatus !== Enums.BOOKING_STATUS.COMPLETED
  ) {
    return next(new ErrorHandler("Invalid Status!", 400));
  }

  // Update the booking
  if (
    (currentStatus === Enums.BOOKING_STATUS.ACCEPTED &&
      newStatus === Enums.BOOKING_STATUS.ONGOING) ||
    (currentStatus === Enums.BOOKING_STATUS.ONGOING &&
      newStatus === Enums.BOOKING_STATUS.CLOSED) ||
    (currentStatus === Enums.BOOKING_STATUS.CLOSED &&
      newStatus === Enums.BOOKING_STATUS.COMPLETED)
  ) {
    // Validations
    if (newStatus === Enums.BOOKING_STATUS.ONGOING) {
      if (!otp) {
        return next(
          new ErrorHandler("OTP is required to start the booking", 400)
        );
      } else if (booking.otp !== otp) {
        return next(new ErrorHandler("Invalid OTP", 400)); // verify that the OTP is matching
      }
    }

    // updating the booking with the startTime & endTime
    if (newStatus === Enums.BOOKING_STATUS.ONGOING) {
      booking = await Booking.findByIdAndUpdate(
        req.params.id,
        { status: newStatus, startTime: Date.now(), startPhotoNumber: photoNumber },
        { new: true, runValidators: true, useFindAndModify: false }
      ).populate("customer");
    } else if (newStatus === Enums.BOOKING_STATUS.CLOSED) {
      booking = await Booking.findByIdAndUpdate(
        req.params.id,
        { status: newStatus, endTime: Date.now(), endPhotoNumber: photoNumber },
        { new: true, runValidators: true, useFindAndModify: false }
      ).populate("customer");
    } else if (newStatus === Enums.BOOKING_STATUS.COMPLETED) {
      booking = await Booking.findByIdAndUpdate(
        req.params.id,
        { status: newStatus },
        { new: true, runValidators: true, useFindAndModify: false }
      ).populate("customer subService service serviceProvider package address");
    }

    // triggering email
    if (newStatus === Enums.BOOKING_STATUS.ONGOING) {
      sendEmail([booking.customer.email], "Booking Started", BOOKING_START);
    } else if (newStatus === Enums.BOOKING_STATUS.CLOSED) {
      // updating the minutesServiced in service providers record
      await User.findByIdAndUpdate(booking.serviceProvider, {
        $inc: { minutesServiced: booking.hours * 60 + booking.minutes },
      });

      // sending booking completion email
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
        { $inc: { amountToBeRedeemed: (booking.totalPrice - booking.taxPrice) * 0.5 } }, //50% given to rider
        { new: true }
      ); 
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
      status: Enums.BOOKING_STATUS.COMPLETED,
    })
      .sort("date")
      .populate("customer address service subService");

    res.status(200).json({
      success: true,
      bookings,
      bookingsCount: bookings.length,
    });
  }
);

// fetch all completed bookings of a user
exports.getBookingsOfCustomer = catchAsyncErrors(
  async (req, res, next) => {
    let bookings = await Booking.find({
      customer: req.query._id
    })
      .sort("-date")
      .populate("customer address service subService serviceProvider");

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
    status: {
      $nin: [Enums.BOOKING_STATUS.COMPLETED, Enums.BOOKING_STATUS.CANCELLED],
    },
  })
  .select("+otp") 
  .populate("customer address service subService serviceProvider")

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
    status: {
      $nin: [Enums.BOOKING_STATUS.CLOSED, Enums.BOOKING_STATUS.CANCELLED],
    },
  })
    .sort("date")
    .populate("customer address service subService")

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

  const createdAtDate = new Date(booking.createdAt);
  const currentTime = new Date();
  const differenceInSeconds = Math.floor((currentTime - createdAtDate) / 1000);

  // Cancel booking if not accepted in 60 seconds
  if (differenceInSeconds >= 60 && booking.status === Enums.BOOKING_STATUS.PLACED) {
    booking = await Booking.findByIdAndUpdate(
      req.params.id,
      {
        status: Enums.BOOKING_STATUS.CANCELLED,
      },
      { new: true, runValidators: true, useFindAndModify: false }
    )

    // refund amount if it was pre-paid order
    if (booking.paymentInfo.status === Enums.PAYMENT_STATUS.PAID) {
      let payment_id = booking.paymentInfo.id,
        amount = booking.totalPrice * 100;
      const instance = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_SECRET,
      });

      const razorpayResponse = await instance.payments.refund(payment_id, {
        amount,
      });
      console.log(
        `Razorpay refund response for booking id ${req.params.id} is ${razorpayResponse}`
      );
    }

    let booking_request = await BookingRequest.findOne({
      booking: req.params.id,
    });
    if (booking_request) await booking_request.deleteOne();
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

/* 
  Get pending amount of the booking after the booking is closed.
  This API will return the amount based on the extra time taken 
*/
exports.getPendingBookingAmount = catchAsyncErrors(async (req, res, next) => {
  let booking = await Booking.findOne({ _id: req.params.id }).populate(
    "customer package service"
  );
  if (!booking) {
    return next(new ErrorHandler("No such booking found", 400));
  } else if (booking.status === Enums.BOOKING_STATUS.COMPLETED) {
    return res.status(200).json({
      success: true,
      message: "Booking already Completed",
      booking,
    });
  } else if (booking.status !== Enums.BOOKING_STATUS.CLOSED) {
    return next(new ErrorHandler("Booking not closed yet.", 400));
  }

  let timeTakenInMinutes = Math.ceil(
    (booking.endTime - booking.startTime) / 60000
  );
  let expectedTimeInMinutes = booking.hours * 60 + booking.minutes;
  let charges = 0;

  if (timeTakenInMinutes <= expectedTimeInMinutes) {
    booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status: Enums.BOOKING_STATUS.COMPLETED },
      { new: true, runValidators: true, useFindAndModify: false }
    ).populate("customer");
  } else {
    // let price = await Price.findOne({
    //   name: `${booking.service.name} ${booking.package.name}`,
    // });
    let price = booking.itemsPrice/expectedTimeInMinutes
    charges =
      Math.abs(timeTakenInMinutes - expectedTimeInMinutes) * price;

    // updating the charges on the booking
    booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { 
        "overtimeDetails.overtimePrice": charges,
        "overtimeDetails.overtimeHours": Math.floor(timeTakenInMinutes / 60),
        "overtimeDetails.overtimeMinutes": timeTakenInMinutes % 60,
        "paymentInfo.balancePayment": booking.paymentInfo.balancePayment + charges,
        status: Enums.BOOKING_STATUS.COMPLETED
      },
      { new: true, runValidators: true, useFindAndModify: false }
    );

    //add redeem amount based on overtime.
    await Redeem.findOneAndUpdate(
      { serviceProvider: req.user._id },
      { $inc: { amountToBeRedeemed: (booking.overtimeDetails.overtimePrice) * 0.6 } }, 
      { new: true }
    );
  }
// UPDATES EXTRA CHARGES FOR EXTRA DURATION
  let curBooking = await Booking.findOne({ _id: req.params.id }).populate(
    "customer"
  )
  sendWhatsAppBalanceMessage(curBooking.customer.contactNumber,curBooking?.paymentInfo?.balancePayment,curBooking._id)

  return res.status(200).json({
    success: true,
    charges,
  });
});

// Create Order for Booking i.e. Pre-Payment Processing
exports.createOrder = catchAsyncErrors(async (req, res, next) => {
  const { service, subService, package, date, amount } = req.body;
  // get all available Service Providers
  // let allServiceProviders = await getAvailableServiceProviders(
  //   date,
  //   service,
  //   subService,
  //   package
  // );
  // if (allServiceProviders.length === 0) {
  //   return next(
  //     new ErrorHandler(
  //       "No service provider is available on the selected date. Please select a new date",
  //       400
  //     )
  //   );
  // }

  const instance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_SECRET,
  });

  const options = {
    amount: amount * 100, // amount in smallest currency unit i.e. paisa
    currency: "INR",
    receipt: `${uuidv4()}`,
  };
  const order = await instance.orders.create(options);

  if (!order)
    return next(
      new ErrorHandler("Something went wrong. Please try again!", 400)
    );

  return res.status(200).json({
    success: true,
    order,
  });
});

// Create payment Success method
exports.paymentSuccess = catchAsyncErrors(async (req, res, next) => {
  const {
    orderCreationId,
    razorpayPaymentId,
    razorpayOrderId,
    razorpaySignature,
    bookingId,
    amount,
    status,
  } = req.body;

  // Creating our own digest, the format should be like this:
  // digest = hmac_sha256(orderCreationId + "|" + razorpayPaymentId, secret);
  const shasum = crypto.createHmac("sha256", process.env.RAZORPAY_SECRET);
  shasum.update(`${orderCreationId}|${razorpayPaymentId}`);
  const digest = shasum.digest("hex");

  // comparing our digest with the actual signature
  if (digest !== razorpaySignature)
    return next(new ErrorHandler("Transaction not legit!", 400));

  try {
    // if (status === 'PARTIAL_PAID') { 
      // Call the external API for booking payment update
      await updateBookingPayment({
        bookingId: bookingId, 
        paymentAmount: amount,  
        transactionId: razorpayPaymentId,
        status:status,
      });
    // }

    // Send success response
    res.json({
      success: true,
      orderId: razorpayOrderId,
      paymentId: razorpayPaymentId,
      message: "Payment verified!",
    });
  } catch (error) {
    console.error("Error while updating booking:", error.message);
    // return next(new ErrorHandler("Booking update failed", 500));

    return next(new ErrorHandler(error?.message, 500));
  }
  // res.json({
  //   success: true,
  //   orderId: razorpayOrderId,
  //   paymentId: razorpayPaymentId,
  // });
});

// Update Payment for Booking using Booking ID
exports.updatePaymentOnBooking = catchAsyncErrors(async (req, res, next) => {
  const { bookingId, paymentAmount, transactionId,status } = req.body;
  // Check if all required fields are provided
  if (!bookingId || !paymentAmount) {
    return next(
      new ErrorHandler("Booking ID &  Payment Amount are required.", 400)
    );
  }

  const bookingInfo = await Booking.findById({ _id: bookingId });

  // Update booking directly
  const booking = await Booking.findByIdAndUpdate(
    bookingId,
    {
      $set: {
        "paymentInfo.paymentReceived": paymentAmount,
        "paymentInfo.status": status,
        "paymentInfo.balancePayment": bookingInfo.totalPrice - paymentAmount  // Calculate balanceAmount
      }
    },
    { new: true, runValidators: true } // Returns updated document
  );

  if (!booking) {
    return next(new ErrorHandler(`No booking found with ID: ${bookingId}`, 404));
  }

  res.status(200).json({
    success: true,
    message: "Payment details updated successfully.",
    booking,
  });
});

