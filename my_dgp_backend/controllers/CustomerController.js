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
exports.registerUserViaOTP = catchAsyncErrors(async (req, res, next) => {
  const { name, email, contactNumber, service } = req.body;
  let role = req.body.role || Enums.USER_ROLES.USER; // in case of service provider, we send role from front_end

  // adding all packages as default
  let package_ids = await Package.find().select("_id");
  package_ids = package_ids.map((id) => id._id.toString());

  const user = await User.create({
    name,
    email,
    contactNumber,
    role,
    service,
    packages: package_ids,
  });

  await Redeem.create({
    serviceProvider: user._id,
  });

  sendToken(user, 201, res);
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
