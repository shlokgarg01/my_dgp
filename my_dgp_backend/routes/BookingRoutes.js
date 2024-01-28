const express = require("express");
const { isAuthenticatedUser } = require("../middleware/Auth");
const {
  createBooking,
  getFutureBookingsOfAUser,
  getCurrentBookingsOfAUser,
  getCompletedBookingsOfAUser,
  updateBookingStatus,
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

module.exports = router;
