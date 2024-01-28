const RedeemRequests = require("../models/RedeemRequestsModel");
const Redeem = require("../models/RedeemModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middleware/CatchAsyncErrors");
const Enums = require("../utils/Enums");

// get all Redeem Requests -- Admin
exports.getAllRedeemRequests = catchAsyncErrors(async (req, res, next) => {
  const redeemRequests = await RedeemRequests.find()
    .populate("serviceProvider")
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    redeemRequests,
  });
});

// update status of Redeem Request -- Admin
exports.updateRedeemRequestStatus = catchAsyncErrors(async (req, res, next) => {
  const status = req.body.status;
  let redeemRequest = await RedeemRequests.findById(req.params.id);

  if (!redeemRequest) {
    return next(new ErrorHandler(`No such request exists.`, 404));
  } else if (redeemRequest.status === Enums.REDEEM_REQUEST_STATUS.CLOSED) {
    return next(
      new ErrorHandler(`Cannot update status of a closed request`, 400)
    );
  } else if (
    ![
      Enums.REDEEM_REQUEST_STATUS.CLOSED,
      Enums.REDEEM_REQUEST_STATUS.CANCELLED,
    ].includes(status)
  ) {
    return next(new ErrorHandler(`Invalid Status!`, 400));
  }

  if (redeemRequest.status === Enums.REDEEM_REQUEST_STATUS.PENDING) {
    redeemRequest = await RedeemRequests.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    // updating amount in the redeem table once the request is closed/accepted
    if (status === Enums.REDEEM_REQUEST_STATUS.CLOSED) {
      await Redeem.findOneAndUpdate(
        { serviceProvider: redeemRequest.serviceProvider },
        { $inc: { amountRedeemed: redeemRequest.amount } }
      );
    }
  }

  res.status(200).json({
    success: true,
    redeemRequest,
  });
});

// create a redeem request by a service provider
exports.createRedeemRequest = catchAsyncErrors(async (req, res, next) => {
  let amount = req.body.amount;
  let userId = req.user._id;

  let redeem = await Redeem.findOne({ serviceProvider: userId });
  if (redeem.amountToBeRedeemed - amount < 0) {
    return next(
      new ErrorHandler(
        `Cannot redeem more than ${redeem.amountToBeRedeemed}`,
        404
      )
    );
  }

  const redeemRequest = await RedeemRequests.create({
    serviceProvider: userId,
    amount: amount,
  });

  await Redeem.findOneAndUpdate(
    { serviceProvider: userId },
    { $inc: { amountToBeRedeemed: -amount } }
  );

  res.status(200).json({
    success: true,
    redeemRequest,
  });
});
