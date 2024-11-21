const mongoose = require("mongoose");
const Enums = require("../utils/Enums");

const counterSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  seq: { type: Number, default: 0 },
});
const Counter = mongoose.model("Counter", counterSchema);

const bookingModel = new mongoose.Schema(
  {
    _id: { type: String },
    customer: {
      type: mongoose.Schema.ObjectId,
      ref: "Customer",
      required: true,
    },
    serviceProvider: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: false,
    },
    service: {
      type: mongoose.Schema.ObjectId,
      ref: "Service",
      required: false,
    },
    subService: {
      type: mongoose.Schema.ObjectId,
      ref: "SubService",
      required: false,
    },
    package: {
      type: mongoose.Schema.ObjectId,
      ref: "Package",
      required: false,
    },
    date: {
      type: Date,
      required: [true, "Booking Date is required"],
    },
    hours: {
      type: Number,
      required: false,
      default: 1,
    },
    minutes: {
      type: Number,
      required: false,
      default: 0,
    },
    address: {
      type: mongoose.Schema.ObjectId,
      ref: "Address",
      required: true,
    },
    paymentInfo: {
      id: {
        type: String,
        required: true,
      },
      status: {
        type: String,
        required: true,
        default: Enums.PAYMENT_STATUS.NOT_PAID,
      },
      paymentReceived:{
        default:0,
        type:Number
      },
      balancePayment:{
        default:0,
        type:Number
      }
    },
    paidAt: {
      type: Date,
      required: true,
    },
    coupon: {
      type: String,
      default: "",
    },
    couponDiscount: {
      type: Number,
      default: 0,
    },
    itemsPrice: {
      type: Number,
      required: true,
      default: 0,
    },
    taxPrice: {
      type: Number,
      required: true,
      default: 0,
    },
    totalPrice: {
      type: Number,
      required: true,
      default: 0,
    },
    overtimePrice: {
      type: Number,
      default: 0,
    },
    otp: {
      type: Number,
      required: false,
      select: false, // this will not get the otp whenever we make query to db
    },
    status: {
      type: String,
      required: true,
      default: Enums.BOOKING_STATUS.PLACED,
    },
    startTime: {
      type: Date,
    },
    endTime: {
      type: Date,
    },
    startPhotoNumber: {
      type: Number
    },
    endPhotoNumber: {
      type: Number
    }
  },
  {
    timestamps: {
      createdAt: "createdAt",
      updatedAt: "updatedAt",
    },
  }
);

// Pre-save hook to auto-increment _id
bookingModel.pre("save", async function (next) {
  const doc = this;
  try {
    const counter = await Counter.findByIdAndUpdate(
      { _id: "entityId" }, // Fixed identifier for this sequence
      { $inc: { seq: 1 } }, // Increment the sequence by 1
      { new: true, upsert: true, useFindAndModify: false } // Create the document if it doesn't exist
    );
    const idString = counter.seq.toString().padStart(6, "0"); // Ensure 6-digit format
    doc._id = idString;
    next();
  } catch (error) {
    console.error("Error in findByIdAndUpdate:", error);
    next(error);
  }
});

module.exports = mongoose.model("Booking", bookingModel);
