const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middleware/CatchAsyncErrors");
const User = require("../models/UserModel");
const Redeem = require("../models/RedeemModel");
const Booking = require("../models/BookingModel");
const sendToken = require("../utils/JwtToken");
const Enums = require("../utils/Enums");
const { getDaysFromCreatedAt } = require("../utils/orderUtils");

// Logout User
exports.logout = catchAsyncErrors(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "Logged out successfully.",
  });
});

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

  const user = await User.create({
    name,
    email,
    contactNumber,
    role,
    service,
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

// get user details
exports.getUserDetails = catchAsyncErrors(async (req, res, next) => {
  let user = await User.findById(req.user.id);
  if (user) {
    const ordersCount = await Booking.countDocuments({
      serviceProvider: user?._id,
      status: Enums.BOOKING_STATUS.CLOSED,
    });
    user = {
      ...user._doc,
      days: getDaysFromCreatedAt(user?.createdAt),
      orders: ordersCount,
    };
  }

  res.status(200).json({
    success: true,
    user,
  });
});

// update profile
exports.updateProfile = catchAsyncErrors(async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
    contactNumber: req.body.contactNumber,
  };

  const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    user,
  });
});

// update fcm token
exports.updateFCMTokem = catchAsyncErrors(async (req, res, next) => {
  const {fcm_token} = req.body

  const user = await User.findByIdAndUpdate(req.user.id, {fcm_token}, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    user,
    message: "FCM token updated successfully"
  });
});

// change the on duty / status
exports.updateDutyStatus = catchAsyncErrors(async (req, res, next) => {
  const status = req.body.status;
  if (
    ![
      Enums.SERVICE_PROVIDER_STATUS.ACTIVE,
      Enums.SERVICE_PROVIDER_STATUS.INACTIVE,
    ].includes(status)
  ) {
    return next(new ErrorHandler("Invalid Duty Status."));
  } else if (req.user.role === Enums.USER_ROLES.USER) {
    return next(new ErrorHandler("Cannot change status of a user."));
  }

  const user = await User.findByIdAndUpdate(
    req.user.id,
    { status },
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
  );

  res.status(200).json({
    success: true,
    user,
  });
});
