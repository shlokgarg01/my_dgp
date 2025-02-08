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
  updateFCMTokem,
  updateProfilePicture,
  updateLastActiveLocation,
  getAllServiceProviders
} = require("../controllers/UserController");
const { isAuthenticatedUser } = require("../middleware/Auth");
const router = express.Router();
const multer = require("multer");
const upload = multer();

router.route("/register/otp/send").post(sendOTPForRegistration);
router.route("/register/otp").post(registerUserViaOTP);

router.route("/login/otp/send").post(sendOTPForLogin);
router.route("/login/otp/verify").post(authenticateUserViaOTPForLogin);
router.route("/logout").get(logout);

router.route("/me").get(isAuthenticatedUser, getUserDetails);
router.route("/me/update").put(isAuthenticatedUser, updateProfile);
router.route("/me/updatephoto").post(isAuthenticatedUser, upload.any(), updateProfilePicture);
router.route("/me/update_status").put(isAuthenticatedUser, updateDutyStatus);
router.route("/me/update_fcm").put(isAuthenticatedUser, updateFCMTokem);
router.route("/me/updateLastLocation").patch(isAuthenticatedUser,updateLastActiveLocation)

router.route("/team/all").get(getAllServiceProviders)

module.exports = router;
