const express = require("express");
const {
  registerCustomer,
  sendOTPForRegistration,
  sendOTPForLogin,
  authenticateUserViaOTPForLogin,
  updateCustomer,
  getCustomerDetails,
} = require("../controllers/CustomerController");
const { isAuthenticatedUser } = require("../middleware/Auth");

const router = express.Router();

// router.route("/register/otp/send").post(sendOTPForRegistration);
router.route("/customer/register").post(registerCustomer);

// router.route("/login/otp/send").post(sendOTPForLogin);
// router.route("/login/otp/verify").post(authenticateUserViaOTPForLogin);

router.route("/customer").get(isAuthenticatedUser, getCustomerDetails);
router.route("/customer/update").put(isAuthenticatedUser, updateCustomer);

module.exports = router;
