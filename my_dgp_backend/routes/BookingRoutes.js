const express = require("express");
const { isAuthenticatedUser } = require("../middleware/Auth");
const {
  createBooking,
  getFutureBookingsOfAUser,
  getCurrentBookingsOfAUser,
  getCompletedBookingsOfAUser,
  updateBookingStatus,
  confirmBookingStatus,
  getPendingBookingAmount,
  createOrder,
  paymentSuccess,
} = require("../controllers/BookingController");
const router = express.Router();

router.route("/bookings/new").post(isAuthenticatedUser, createBooking);
router
  .route("/bookings/updateStatus/:id")
  .put(isAuthenticatedUser, updateBookingStatus);

router
  .route("/bookings/completed")
  .get(isAuthenticatedUser, getCompletedBookingsOfAUser);
router
  .route("/bookings/future")
  .get(isAuthenticatedUser, getFutureBookingsOfAUser);
router
  .route("/bookings/current")
  .get(isAuthenticatedUser, getCurrentBookingsOfAUser);
router.route("/bookings/status/:id").get(isAuthenticatedUser, confirmBookingStatus);
router.route("/bookings/pendingAmount/:id").get(isAuthenticatedUser, getPendingBookingAmount)

// Booking Routes
router.route("/bookings/createOrder").post(createOrder)
router.route("/bookings/payment/success").post(paymentSuccess)

module.exports = router;
