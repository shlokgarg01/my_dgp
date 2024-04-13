const BookingRequest = require("../models/BookingRequestsModel");
const Booking = require("../models/BookingModel");
const catchAsyncErrors = require("../middleware/CatchAsyncErrors");
const ErrorHandler = require("../utils/errorHandler");
const Enums = require("../utils/Enums");
const { generateOTP } = require("../helpers/UserHelpers");
const { sendEmail } = require("../helpers/Notifications");

// get all booking requests
exports.getAllBookingRequests = catchAsyncErrors(async (req, res, next) => {
  let bookingRequests = await BookingRequest.find({
    serviceProviders: { $elemMatch: { $eq: req.user._id } },
  }).populate("booking customer serviceProviders service address");

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
      1. Update the logic to fetch servie providers - params - date on booking, leaves, service & sorting
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
      );
      // TODO - send otp to email here
      // sendEmail()
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
