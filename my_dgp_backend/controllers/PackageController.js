const Package = require("../models/PackageModel");
const catchAsyncErrors = require("../middleware/CatchAsyncErrors");
const ErrorHandler = require("../utils/errorHandler");

// create a package
exports.createPackage = catchAsyncErrors(async (req, res, next) => {
  const { name, priority } = req.body;
  const package = await Package.create({
    name,
    priority,
  });

  res.status(200).json({
    success: true,
    package,
  });
});

// create a package
exports.editPackage = catchAsyncErrors(async (req, res, next) => {
  const packageId = req.params.id;
  let package = await Package.findOne({ _id: packageId });
  if (!package) {
    return next(new ErrorHandler("No package with this id exist!", 400));
  }

  const { name } = req.body;
  await Package.findByIdAndUpdate(
    packageId,
    { name },
    { new: true, runValidators: true, useFindAndModify: false }
  );

  res.status(200).json({
    success: true,
    package,
  });
});

// get all packages
exports.getPackages = catchAsyncErrors(async (req, res, next) => {
  const packages = await Package.find();

  res.status(200).json({
    success: true,
    packages,
  });
});
