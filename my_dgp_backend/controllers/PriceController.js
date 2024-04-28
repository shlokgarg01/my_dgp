const Price = require("../models/PriceModel");
const catchAsyncErrors = require("../middleware/CatchAsyncErrors");
const ErrorHandler = require("../utils/errorHandler");

// create a price
exports.createPrice = catchAsyncErrors(async (req, res, next) => {
  const { name, charges } = req.body;
  const price = await Price.create({
    name,
    charges,
  });

  res.status(200).json({
    success: true,
    price,
  });
});

// edit a price
exports.editPrice = catchAsyncErrors(async (req, res, next) => {
  const priceId = req.params.id;
  let price = await Price.findOne({ _id: priceId });
  if (!price) {
    return next(new ErrorHandler("No price entry with this id exist!", 400));
  }

  price = await Price.findByIdAndUpdate(priceId, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    price,
  });
});

// get all prices
exports.getPrices = catchAsyncErrors(async (req, res, next) => {
  const prices = await Price.find();

  res.status(200).json({
    success: true,
    prices,
  });
});
