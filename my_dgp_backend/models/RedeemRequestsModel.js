const mongoose = require("mongoose");
const Enums = require("../utils/Enums");

const redeemRequestSchema = new mongoose.Schema(
  {
    serviceProvider: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    amount: {
      type: Number,
      default: 0
    },
    status: {
      type: String,
      default: Enums.REDEEM_REQUEST_STATUS.PENDING
    }
  },
  {
    timestamps: {
      createdAt: "createdAt",
      updatedAt: "updatedAt",
    },
  }
);

module.exports = mongoose.model("RedeemRequest", redeemRequestSchema);