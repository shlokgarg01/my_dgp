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

  let todayMinutesServiced = 0,
    lastMonthMinutesServiced = 0,
    lastWeekMinutesServiced = 0,
    totalEarnings = 0,
    todayEarnings = 0,
    lastMonthEarnings = 0,
    lastWeekEarnings = 0,
    todayCashCollected = 0,
    lastWeekCashCollected = 0,
    lastMonthCashCollected = 0,
    totalCashCollected = 0;
  let lastMonthDate = new Date(currentDate - 1000 * 60 * 60 * 24 * 30); // date 30 days back
  let lastWeekDate = new Date(currentDate - 1000 * 60 * 60 * 24 * 7); // date 7 days back

  // today's minutes serviced & earnings
  let bookings = await Booking.find({
    serviceProvider: req.user._id,
    date: {
      $gte: currentDate,
      $lt: nextDay,
    },
    status: [Enums.BOOKING_STATUS.CLOSED, Enums.BOOKING_STATUS.COMPLETED],
  });
  bookings.map((booking) => {
    todayMinutesServiced += booking.hours * 60 + (booking.minutes || 0);
    todayEarnings += (booking.totalPrice+booking.overtimePrice) * 0.6; // giving 60% to service_provider for every booking
    todayCashCollected += booking.overtimePrice;
  });

  // last week minutes services & earnings
  bookings = await Booking.find({
    serviceProvider: req.user._id,
    date: {
      $gte: lastWeekDate,
      $lt: currentDate,
    },
    status: [Enums.BOOKING_STATUS.CLOSED, Enums.BOOKING_STATUS.COMPLETED],
  });
  bookings.map((booking) => {
    lastWeekMinutesServiced += booking.hours * 60 + (booking.minutes || 0);
    lastWeekEarnings +=(booking.totalPrice+booking.overtimePrice) * 0.6; // giving 60% to service_provider for every booking
    lastWeekCashCollected += booking.overtimePrice;
  });

  // last month minutes serviced & earnings
  bookings = await Booking.find({
    serviceProvider: req.user._id,
    date: {
      $gte: lastMonthDate,
      $lte: currentDate,
    },
    status: [Enums.BOOKING_STATUS.CLOSED, Enums.BOOKING_STATUS.COMPLETED],
  });
  bookings.map((booking) => {
    lastMonthMinutesServiced += booking.hours * 60 + (booking.minutes || 0);
    lastMonthEarnings += (booking.totalPrice+booking.overtimePrice) * 0.6; // giving 60% to service_provider for every booking
    lastMonthCashCollected += booking.overtimePrice;
  });

  // total Earnings
  bookings = await Booking.find({
    serviceProvider: req.user._id,
    status: [Enums.BOOKING_STATUS.CLOSED, Enums.BOOKING_STATUS.COMPLETED],
  });
  bookings.map((booking) => {
    totalEarnings += (booking.totalPrice+booking.overtimePrice) * 0.6; // giving 60% to service_provider for every booking
    totalCashCollected += booking.overtimePrice;
  });

  res.status(200).json({
    success: true,
    redeem,
    minutesServiced: {
      today: todayMinutesServiced,
      lastWeek: lastWeekMinutesServiced,
      lastMonth: lastMonthMinutesServiced,
      total: service_provider?.minutesServiced || 0,
    },
    earnings: {
      today: todayEarnings,
      lastWeek: lastWeekEarnings,
      lastMonth: lastMonthEarnings,
      total: totalEarnings,
    },
    cashCollected: {
      today: todayCashCollected,
      lastWeek: lastWeekCashCollected,
      lastMonth: lastMonthCashCollected,
      total: totalCashCollected
    }
  });
});
