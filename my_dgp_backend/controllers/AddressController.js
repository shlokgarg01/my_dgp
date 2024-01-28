const Address = require("../models/AddressModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middleware/CatchAsyncErrors");

// create address
exports.createAddress = catchAsyncErrors(async (req, res, next) => {
  req.body.user = req.user.id;

  const address = await Address.create(req.body);
  res.status(200).json({
    success: true,
    address,
  });
});

// get address details
exports.getAddressDetails = catchAsyncErrors(async (req, res, next) => {
  const address = await Address.findById(req.params.id);

  if (!address) {
    return next(new ErrorHandler("Address Not Found", 404));
  }

  res.status(200).json({
    success: true,
    address,
  });
});

// update an address
exports.updateAddress = catchAsyncErrors(async (req, res, next) => {
  let address = await Address.findById(req.params.id);
  if (!address) {
    return next(new ErrorHandler("Address Not Found.", 404));
  }

  address = await Address.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    address,
  });
});

// delete an address
exports.deleteAddress = catchAsyncErrors(async (req, res, next) => {
  const address = await Address.findById(req.params.id);
  if (!address) {
    return next(new ErrorHandler("Address Not Found", 404));
  }

  await address.deleteOne();
  res.status(200).json({
    success: true,
    message: "Address deleted successfully",
  });
});

// My Saved Addresses for a logged in user
exports.myAddresses = catchAsyncErrors(async (req, res, next) => {
  const addresses = await Address.find({ user: req.user._id });

  res.status(200).json({
    success: true,
    addresses,
  });
});