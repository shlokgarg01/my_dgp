const mongoose = require("mongoose");
const Enums = require("../utils/Enums");

const bookingModel = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
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
      select: false // this will not get the otp whenever we make query to db
    },
    status: {
      type: String,
      required: true,
      default: Enums.BOOKING_STATUS.PLACED,
    },
    startTime: {
      type: Date
    },
    endTime: {
      type: Date
    }
  },
  {
    timestamps: {
      createdAt: "createdAt",
      updatedAt: "updatedAt",
    },
  }
);

module.exports = mongoose.model("Booking", bookingModel);
