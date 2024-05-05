const express = require("express");
const Enums = require("../utils/Enums");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/Auth");
const {
  getAllBookingRequests,
  updateStatusOfBookingRequest,
  cancelBookingRequest,
} = require("../controllers/BookingRequestsController");
const router = express.Router();

router
  .route("/bookingrequests")
  .get(
    isAuthenticatedUser,
    authorizeRoles(Enums.USER_ROLES.SERVICE_PROVIDER),
    getAllBookingRequests
  );
router
  .route("/bookingrequests/updateStatus/:id")
  .post(isAuthenticatedUser, updateStatusOfBookingRequest);
router.route("/bookingrequest/cancel/:id").post(cancelBookingRequest)

module.exports = router;
