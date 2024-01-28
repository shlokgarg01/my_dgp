const BookingRequest = require("../models/BookingRequestsModel");
const Booking = require("../models/BookingModel");
const catchAsyncErrors = require("../middleware/CatchAsyncErrors");
const ErrorHandler = require("../utils/errorHandler");
const Enums = require("../utils/Enums");
const { getAvailableServiceProviders } = require("../helpers/UserHelpers");

// get all booking requests
exports.getAllBookingRequests = catchAsyncErrors(async (req, res, next) => {
  let bookingRequests = await BookingRequest.find({
    serviceProvider: req.user._id,
  }).populate("booking customer serviceProvider service address");

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
    const bookingRequest = await BookingRequest.findOne({
      _id: req.params.id,
      serviceProvider: req.user._id,
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
        { status, serviceProvider: req.user._id },
        { new: true, runValidators: true, useFindAndModify: false }
      );
      await bookingRequest.deleteOne();
    } else if (status === Enums.BOOKING_REQUEST_STATUS.REJECTED) {
      booking = await Booking.findById(bookingRequest.booking);
      let allServiceProviders = await getAvailableServiceProviders(
        booking.date,
        booking.service
      );

      // finding the current service provider's index from the list
      let currentServiceProviderIndex = allServiceProviders.indexOf(
        bookingRequest.serviceProvider.toString()
      );

      // new service provider's index = If current index is last index, then assigning the first index, else assiging the next index.
      let newServiceProviderIndex =
        currentServiceProviderIndex === allServiceProviders.length - 1
          ? 0
          : currentServiceProviderIndex + 1;
      
      // getting the new service provider from the list based on the above index.
      let newServiceProvider = allServiceProviders[newServiceProviderIndex];

      await BookingRequest.findByIdAndUpdate(
        req.params.id,
        { serviceProvider: newServiceProvider },
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
