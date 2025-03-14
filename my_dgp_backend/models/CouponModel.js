const mongoose = require("mongoose");
const Enums = require("../utils/Enums");

const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: [true, "Coupon code is required"],
    },
    value: {
      type: Number,
      required: true,
    },
    type: {
      type: String,
      default: Enums.COUPON_TYPE.FLAT_VALUE,
      trim: true,
    },
    minCartValue: {
      type: Number,
      default: 0,
    },
    validContactNumbers:{
      type: Array,
      default:[],
    },
    validPackageId:{
      type: Array,
      default:[],
    },
    expires: {
      type: Date,
      default: Date.now() + 100 * 24 * 60 * 60 * 1000, // default expiry is 100 days from now (in milliseconds)
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: {
      createdAt: "createdAt",
      updatedAt: "updatedAt",
    },
  }
);

// Validating Coupon Type
couponSchema.path("type").validate((type) => {
  const enums = [Enums.COUPON_TYPE.FLAT_VALUE, Enums.COUPON_TYPE.PERCENTAGE];
  return enums.includes(type.toUpperCase());
}, "Invalid coupon type, can only be FLAT_VALUE or PERCENTAGE");

// If Coupon Type is PERCENTAGE, then % should be between 0-100
couponSchema.pre("save", function (next) {
  this.type = this.type.toUpperCase();
  if (
    this.type === Enums.COUPON_TYPE.PERCENTAGE &&
    !(this.value >= 0 && this.value <= 100)
  ) {
    error = new Error("Invalid percentage value");
    next(error);
  }
  next();
});

couponSchema.pre("findOneAndUpdate", async function (next) {
  const docToUpdate = await this.model.findOne(this.getQuery());
  const newValues = this?._update;
  if (newValues.type) newValues.type = newValues.type.toUpperCase();

  const type = newValues.type || docToUpdate.type;
  const value = newValues.value || docToUpdate.value;
  if (type === Enums.COUPON_TYPE.PERCENTAGE && !(value >= 0 && value <= 100)) {
    error = new Error("Invalid percentage value");
    next(error);
  }

  next();
});

module.exports = mongoose.model("Coupon", couponSchema);