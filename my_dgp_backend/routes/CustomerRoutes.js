const express = require("express");
const {
  registerCustomer,
  isCustomerRegistered,
  getCustomerDetails,
} = require("../controllers/CustomerController");
const { isAuthenticatedUser } = require("../middleware/Auth");

const router = express.Router();

router.route("/customer/register").post(registerCustomer);
router.route("/customer/isExist").get(isCustomerRegistered);
router.route("/customer").get( getCustomerDetails);

module.exports = router;
