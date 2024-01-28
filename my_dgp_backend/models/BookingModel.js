const mongoose = require("mongoose");
const Enums = require('../utils/Enums')

const bookingModel = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true
    },
    serviceProvider: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: false
    },
    service: {
      type: mongoose.Schema.ObjectId,
      ref: "Service",
      required: false
    },
    date: {
      type: Date,
      required: [true, "Booking Date is required"]
    },
    hours: {
      type: Number,
      required: false,
      default: 1
    },
    address: {
      type: mongoose.Schema.ObjectId,
      ref: 'Address',
      required: true
    },
    paymentInfo: {
      id: {
        type: String,
        required: true,
      },
      status: {
        type: String,
        required: true,
        default: Enums.PAYMENT_STATUS.NOT_PAID
      },
    },
    paidAt: {
      type: Date,
      required: true,
    },
    coupon: {
      type: String,
      default: ""
    },
    couponDiscount: {
      type: Number,
      default: 0
    },
    itemsPrice: {
      type: Number,
      requierd: true,
      default: 0
    },
    taxPrice: {
      type: Number,
      requierd: true,
      default: 0,
    },
    totalPrice: {
      type: Number,
      requierd: true,
      default: 0,
    },
    status: {
      type: String,
      required: true,
      default: Enums.BOOKING_STATUS.PLACED,
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
