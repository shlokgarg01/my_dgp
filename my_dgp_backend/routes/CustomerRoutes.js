const express = require("express");
const {
  registerUserViaOTP,
  sendOTPForRegistration,
  sendOTPForLogin,
  authenticateUserViaOTPForLogin,
  updateCustomer,
  getCustomerDetails,
} = require("../controllers/CustomerController");

const router = express.Router();

// router.route("/register/otp/send").post(sendOTPForRegistration);
// router.route("/register/otp").post(registerUserViaOTP);

// router.route("/login/otp/send").post(sendOTPForLogin);
// router.route("/login/otp/verify").post(authenticateUserViaOTPForLogin);

router.route("/customer").get(isAuthenticatedUser, getCustomerDetails);
router.route("/customer/update").put(isAuthenticatedUser, updateCustomer);

module.exports = router;
