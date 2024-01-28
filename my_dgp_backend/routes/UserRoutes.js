const express = require("express");
const {
  logout,
  registerUserViaOTP,
  sendOTPForRegistration,
  sendOTPForLogin,
  authenticateUserViaOTPForLogin,
  getUserDetails,
  updateProfile,
  updateDutyStatus,
} = require("../controllers/UserController");
const { isAuthenticatedUser } = require("../middleware/Auth");
const router = express.Router();

router.route("/register/otp/send").post(sendOTPForRegistration);
router.route("/register/otp").post(registerUserViaOTP);

router.route("/login/otp/send").post(sendOTPForLogin);
router.route("/login/otp/verify").post(authenticateUserViaOTPForLogin);
router.route("/logout").get(logout);

router.route("/me").get(isAuthenticatedUser, getUserDetails);
router.route("/me/update").put(isAuthenticatedUser, updateProfile);
router.route("/me/update_status").put(isAuthenticatedUser, updateDutyStatus);

module.exports = router;
