const Razorpay = require("razorpay");

const BookingRequest = require("../models/BookingRequestsModel");
const Booking = require("../models/BookingModel");
const catchAsyncErrors = require("../middleware/CatchAsyncErrors");
const ErrorHandler = require("../utils/errorHandler");
const Enums = require("../utils/Enums");
const { generateOTP } = require("../helpers/UserHelpers");
const { sendEmail } = require("../helpers/Notifications");
const { BOOKING_OTP, BOOKING_ACCEPTANCE } = require("../Data/Messages");

// get all booking requests
exports.getAllBookingRequests = catchAsyncErrors(async (req, res, next) => {
  let bookingRequests = await BookingRequest.find({
    serviceProviders: { $elemMatch: { $eq: req.user._id } },
  })
    .populate("booking customer serviceProviders service address")
    .populate({
      path: "booking",
      populate: {
        path: "subService package",
      },
    });

  res.status(201).json({
    success: true,
    bookingRequests,
  });
});

// update status of booking request to ACCEPTED or REJECTED
exports.updateStatusOfBookingRequest = catchAsyncErrors(
  async (req, res, next) => {
    /*
      -------------------- LOGIC --------------------
      1. Update the logic to fetch service providers - params - date on booking, leaves, service & sorting
      2. Fetch all service providers and find the current service provider by id from the list
      3. update the service provider id on the booking request to the next id from the list
      4. If this was the last id in the list, update it to the first id.
    */

    const { status } = req.body;
    let service_provider_id = req.user._id;
    const bookingRequest = await BookingRequest.findOne({
      _id: req.params.id,
      serviceProviders: { $elemMatch: { $eq: service_provider_id } }, // booking request which contains the current service provider in the array
    });

    if (!bookingRequest) {
      return next(new ErrorHandler("Booking Request Not Found", 404));
    } else if (
      status !== Enums.BOOKING_REQUEST_STATUS.ACCEPTED &&
      status !== Enums.BOOKING_REQUEST_STATUS.REJECTED
    ) {
      return next(new ErrorHandler("Invalid status!", 400));
    }

    let booking;

    if (status === Enums.BOOKING_REQUEST_STATUS.ACCEPTED) {
      booking = await Booking.findByIdAndUpdate(
        bookingRequest.booking,
        { status, serviceProvider: service_provider_id, otp: generateOTP() },
        { new: true, runValidators: true, useFindAndModify: false }
      )
        .select("+otp")
        .populate("customer address serviceProvider service");

      sendEmail(
        [booking.address.email || booking.customer.email],
        "Booking Confirmation",
        null,
        `
          ${BOOKING_ACCEPTANCE}
          <h3>Booking Details</h3>
          <b>Booking Date</b>: ${new Date(booking.date).toDateString()}<br />
          <b>Name</b>: ${booking.customer.name}<br />
          <b>Address</b>: ${booking.address.address}, ${booking.address.country
        }<br />
          <b>Amount</b>: ₹ ${booking.totalPrice}<br />
          <b>Service</b>: ${booking.service.name}<br />
          <b>Service Provider</b>: ${booking.serviceProvider.name}<br />
        `
      );
      sendEmail(
        [booking.address.email || booking.customer.email],
        "Booking OTP",
        BOOKING_OTP + booking.otp
      );
      await bookingRequest.deleteOne();
    } else if (status === Enums.BOOKING_REQUEST_STATUS.REJECTED) {
      booking = await Booking.findById(bookingRequest.booking);

      await BookingRequest.findByIdAndUpdate(
        req.params.id,
        { $pull: { serviceProviders: service_provider_id } }, // remove the current service provider from the booking request
        { new: true, runValidators: true, useFindAndModify: false }
      );
    }

    res.status(200).json({
      success: true,
      message: "Status Updated",
      booking,
    });
  }
);

// cancel booking request from searching rider page
exports.cancelBookingRequest = catchAsyncErrors(async (req, res, next) => {
  let booking_id = req.params.id;
  let booking_request = await BookingRequest.findOne({ booking: booking_id });
  // if (!booking_request) {
  //   return next(new ErrorHandler("Booking already accepted", 400));
  // }

  let booking = await Booking.findByIdAndUpdate(
    booking_id,
    { status: Enums.BOOKING_STATUS.CANCELLED },
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
  );

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
      `Razorpay refund response for booking id ${booking_id} is ${razorpayResponse}`
    );
  }

  await booking_request.deleteOne();
  return res.status(200).json({
    success: true,
    message: "Booking Deleted!",
    booking,
  });
});
