const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middleware/CatchAsyncErrors");
const Customer = require("../models/CustomerModel");
const { getDaysFromCreatedAt } = require("../utils/orderUtils");

// register customer
exports.registerCustomer = catchAsyncErrors(async (req, res) => {
  const { name, email, contactNumber } = req.body;

  const customer = await Customer.create({
    name,
    email,
    contactNumber,
  });

  res.status(200).json({
    success: true,
    customer,
  });

  //   sendToken(customer, 201, res);
});

exports.isCustomerRegistered = catchAsyncErrors(
  async (req, res) => {
    const { contactNumber } = req.query;

    let user = await Customer.findOne({ contactNumber });

    if (!user) {
      res.status(200).json({
        success: true,
        isRegistered: false,
      });
    }

    res.status(200).json({
      success: true,
      isRegistered: true,
      user
    });
  }
);

// get customer details
exports.getCustomerDetails = catchAsyncErrors(async (req, res, next) => {
  const { contactNumber } = req.body;
  let customer = await Customer.findOne({ contactNumber });

  if (!customer) {
    return next(
      new ErrorHandler("No user found for the given Contact Number.", 404)
    );
  }

  res.status(200).json({
    success: true,
    customer,
  });
});
