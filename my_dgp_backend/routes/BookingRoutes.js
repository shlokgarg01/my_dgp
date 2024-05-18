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

module.exports = router;
