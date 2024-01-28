const Leave = require('../models/LeaveModel')
const catchAsyncErrors = require("../middleware/CatchAsyncErrors");
const ErrorHandler = require('../utils/errorHandler');
const Enums = require('../utils/Enums');

// apply Leave
exports.applyLeave = catchAsyncErrors(async (req, res, next) => {
  let serviceProvider = req.user._id
  let leave = await Leave.create({...req.body, serviceProvider})

  res.status(200).json({
    success: true,
    leave
  })
})

// get All leaves of a user
exports.getLeavesofUser = catchAsyncErrors(async(req, res, next) => {
  let leaves = await Leave.aggregate([
    { $match: { serviceProvider: req.user._id } }, // Filter by serviceProvider
    {
      $lookup: {
        from: 'users', // Assuming the name of your User model is 'users'
        localField: 'serviceProvider',
        foreignField: '_id',
        as: 'serviceProvider'
      }
    },
    { $unwind: '$serviceProvider' },
    { $group: { _id: "$status", leaves: { $push: "$$ROOT" } } }, // Group by status
  ]).exec();

  const result = await Promise.all(leaves)
  res.status(200).json({
    success: true,
    leaves: result
  })
})

// get All pending leaves -- Admin
exports.getPendingLeaves = catchAsyncErrors(async (req, res, next) => {
  let leaves = await Leave.find({ status: Enums.LEAVE_STATUS.PENDING })

  res.status(200).json({
    success: true,
    leaves
  })
})

// Update Leave Statsu -- Admin
exports.updateLeaveStatus = catchAsyncErrors(async (req, res, next) => {
  let leave = await Leave.findById(req.params.id)
  let status = req.body.status

  if (!leave) {
    return next(new ErrorHandler("No such leave exists.", 404));
  } else if (leave.status !== Enums.LEAVE_STATUS.PENDING) {
    return next(new ErrorHandler("Leave not in pending state.", 400));
  } else if (!status) {
    return next(new ErrorHandler("Status is required.", 400));
  }

  await Leave.findByIdAndUpdate(req.params.id, {status}, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  })

  res.status(200).json({
    success: true,
    message: "Leave Status update successfully"
  })
})