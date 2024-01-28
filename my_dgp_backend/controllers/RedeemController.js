const Redeem = require("../models/RedeemModel");
const catchAsyncErrors = require("../middleware/CatchAsyncErrors");

// get Redeem Details
exports.getRedeemDetails = catchAsyncErrors(async (req, res, next) => {
  const redeem = await Redeem.findOne({ serviceProvider: req.user._id })
  if (!redeem) redeem = []

  res.status(200).json({
    success: true,
    redeem,
  });
});