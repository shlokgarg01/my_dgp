const { getDaysFromCreatedAt } = require("./orderUtils");
const Booking = require('../models/BookingModel');
const Enums = require("./Enums");

// creating JWT Token & saving it to cookie
const sendToken = async (user, statusCode, res) => {
  const token = user.getJWTToken();
  const ordersCount = await Booking.countDocuments({ serviceProvider: user._id, status: Enums.BOOKING_STATUS.CLOSED })
  user = {...user._doc, days: getDaysFromCreatedAt(user.createdAt), orders: ordersCount}

  // options for cookies
  const options = {
    path: "/",
    sameSite: "strict",
    httpOnly: true,
    secure: true,
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000 // converting COOKIE_EXPIRE from day -> milliseconds
    ),
  };

  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    token,
    user,
  });
};


module.exports = sendToken