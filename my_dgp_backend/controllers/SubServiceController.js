const SubService = require("../models/SubServiceModel");
const catchAsyncErrors = require("../middleware/CatchAsyncErrors");
const ErrorHandler = require("../utils/errorHandler");

// create a sub service
exports.createSubService = catchAsyncErrors(async (req, res, next) => {
  const { name, service } = req.body;
  const subService = await SubService.create({
    name,
    service,
  });

  res.status(200).json({
    success: true,
    subService,
  });
});

// create a service
exports.editSubService = catchAsyncErrors(async (req, res, next) => {
  const subServiceId = req.params.id;
  let subService = await SubService.findOne({ _id: subServiceId });
  if (!subService) {
    return next(new ErrorHandler("No sub service with this id exist!", 400));
  }

  const { name } = req.body;
  await SubService.findByIdAndUpdate(
    subServiceId,
    { name },
    { new: true, runValidators: true, useFindAndModify: false }
  );

  res.status(200).json({
    success: true,
    subService,
  });
});

// get all sub services of a service
exports.getSubServices = catchAsyncErrors(async (req, res, next) => {
  const { serviceId } = req.body;
  const subServices = await SubService.find({
    service: serviceId,
  });

  res.status(200).json({
    success: true,
    subServices,
  });
});
