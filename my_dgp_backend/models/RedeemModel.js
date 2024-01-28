const mongoose = require("mongoose");

const redeemSchema = new mongoose.Schema(
  {
    serviceProvider: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    amountRedeemed: {
      type: Number,
      default: 0
    },
    amountToBeRedeemed: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: {
      createdAt: "createdAt",
      updatedAt: "updatedAt",
    },
  }
);

module.exports = mongoose.model("Redeem", redeemSchema);