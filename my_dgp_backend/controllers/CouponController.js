const Coupon = require("../models/CouponModel");
const catchAsyncErrors = require("../middleware/CatchAsyncErrors");
const ErrorHandler = require("../utils/errorHandler");
const Enums = require("../utils/Enums")

// create coupon -- Admin
exports.createCoupon = catchAsyncErrors(async (req, res, next) => {
  const existingCoupon = await Coupon.findOne({ code: req.body.code });

  if (existingCoupon) {
    return next(
      new ErrorHandler(
        "Coupon code already exist. Cannot create coupon with same name.",
        400
      )
    );
  }
  req.body.user = req.user.id;

  const coupon = await Coupon.create(req.body);
  res.status(200).json({
    success: true,
    coupon,
  });
});

// get all coupons -- Admin
exports.getAllCoupons = catchAsyncErrors(async (req, res) => {
  const couponsCount = await Coupon.countDocuments();
  const coupons = await Coupon.find().populate("user", "name");

  return res.status(200).json({
    success: true,
    coupons,
    couponsCount,
  });
});

// update a coupon -- Admin
exports.updateCoupon = catchAsyncErrors(async (req, res, next) => {
  let coupon = await Coupon.findById(req.params.id);
  if (!coupon) {
    return next(new ErrorHandler("Coupon Not Found.", 404));
  }

  coupon = await Coupon.findOneAndUpdate({ _id: req.params.id }, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    coupon,
  });
});

// get coupon details -- Admin
exports.getCouponDetails = catchAsyncErrors(async (req, res, next) => {
  const coupon = await Coupon.findById(req.params.id).populate("user", "name");

  if (!coupon) {
    return next(new ErrorHandler("Coupon Not Found", 404));
  }

  res.status(200).json({
    success: true,
    coupon,
  });
});

// delete coupon -- Admin
exports.deleteCoupon = catchAsyncErrors(async (req, res, next) => {
  const coupon = await Coupon.findById(req.params.id);

  if (!coupon) {
    return next(new ErrorHandler("Coupon Not Found", 404));
  }

  await coupon.deleteOne();
  res.status(200).json({
    success: true,
    message: "Coupon deleted successfully",
  });
});

// validate a coupon
exports.validateCoupon = catchAsyncErrors(async (req, res, next) => {
  const { code, cartValue } = req.body;
  const coupon = await Coupon.findOne({ code });

  if (!cartValue) {
    return next(new ErrorHandler("Invalid cart value", 400));
  } else if (!coupon) {
    return next(new ErrorHandler("Coupon Not Found", 404));
  } else if (coupon.expires < Date.now()) {
    return next(
      new ErrorHandler(
        "Coupon expired. Please try with some other coupon.",
        400
      )
    );
  } else if (cartValue < coupon.minCartValue) {
    return next(
      new ErrorHandler(
        `Cannot apply this coupon. Please add items worth ₹${coupon.minCartValue} to use this coupon`,
        400
      )
    );
  }

  let discount = 0,
    finalPrice = 0;
  if (coupon.type === Enums.COUPON_TYPE.FLAT_VALUE) {
    discount = coupon.value;
    finalPrice = cartValue - coupon.value;
  } else if (coupon.type === Enums.COUPON_TYPE.PERCENTAGE) {
    discount = (cartValue * coupon.value) / 100;
    finalPrice = cartValue - discount;
  }

  return res.status(200).json({
    success: true,
    discount,
    finalPrice,
    coupon,
  });
});