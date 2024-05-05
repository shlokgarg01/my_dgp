const Redeem = require("../models/RedeemModel");
const User = require("../models/UserModel");
const Booking = require("../models/BookingModel");
const catchAsyncErrors = require("../middleware/CatchAsyncErrors");
const Enums = require("../utils/Enums");

// get Redeem Details
exports.getRedeemDetails = catchAsyncErrors(async (req, res, next) => {
  let redeem = await Redeem.findOne({ serviceProvider: req.user._id });
  let service_provider = await User.findById(req.user._id);
  if (!redeem) redeem = [];

  // calculating today's time serviced
  let currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);
  let nextDay = new Date(currentDate);
  nextDay.setDate(currentDate.getDate() + 1);

  let bookings = await Booking.find({
    serviceProvider: req.user._id,
    date: {
      $gte: currentDate,
      $lt: nextDay,
    },
    status: Enums.BOOKING_STATUS.CLOSED,
  });

  let todayMinutesServiced = 0;
  bookings.map(
    (booking) =>
      todayMinutesServiced + (booking.hours * 60 + (booking.minutes || 0))
  );

  res.status(200).json({
    success: true,
    redeem,
    totalMinutesServiced: service_provider?.minutesServiced || 0,
    todayMinutesServiced
  });
});