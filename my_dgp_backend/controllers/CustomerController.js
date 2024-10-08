const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middleware/CatchAsyncErrors");
const Customer = require("../models/CustomerModel");
const Package = require("../models/PackageModel");
const Redeem = require("../models/RedeemModel");
const Booking = require("../models/BookingModel");
const sendToken = require("../utils/JwtToken");
const Enums = require("../utils/Enums");
const { getDaysFromCreatedAt } = require("../utils/orderUtils");
const { uploadFile } = require("../services/googleAPI");

// send OTP for registration
exports.sendOTPForRegistration = catchAsyncErrors(async (req, res, next) => {
  const { contactNumber } = req.body;
  const user = await User.findOne({ contactNumber });
  if (user) {
    return next(
      new ErrorHandler(
        "User with this Contact Number already exists. Please login.",
        400
      )
    );
  }

  res.status(200).json({
    success: true,
    message: "OTP can be sent.",
  });
});

// register user via OTP
exports.registerCustomer = catchAsyncErrors(async (req, res, next) => {
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

// send OTP for Login
exports.sendOTPForLogin = catchAsyncErrors(async (req, res, next) => {
  const { contactNumber } = req.body;
  const user = await User.findOne({ contactNumber });
  if (!user) {
    return next(
      new ErrorHandler(
        "User with this Contact Number does not exist. Please Register.",
        400
      )
    );
  }

  res.status(200).json({
    success: true,
    message: "User Present. OTP can be sent",
  });
});

// autheticate the User for Login
exports.authenticateUserViaOTPForLogin = catchAsyncErrors(
  async (req, res, next) => {
    const { contactNumber } = req.body;
    let user = await User.findOne({ contactNumber });
    if (!user) {
      return next(
        new ErrorHandler("No user found for the given Contact Number.", 404)
      );
    }

    sendToken(user, 201, res);
  }
);

// get customer details
exports.getCustomerDetails = catchAsyncErrors(async (req, res, next) => {
  let customer = await Customer.findById(req.customer.id);
//   if (customer) {
//     customer = {
//       ...customer._doc,
//     };
//   }

  res.status(200).json({
    success: true,
    customer,
  });
});

// update customer
exports.updateCustomer = catchAsyncErrors(async (req, res, next) => {
  const customer = await Customer.findByIdAndUpdate(req.customer.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    customer,
  });
});
