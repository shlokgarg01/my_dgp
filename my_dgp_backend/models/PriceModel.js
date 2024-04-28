const mongoose = require("mongoose");

const priceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    charges: { // per minute
      type: Number,
      required: true
    }
  },
  {
    timestamps: {
      createdAt: "createdAt",
      updatedAt: "updatedAt",
    },
  }
);

module.exports = mongoose.model("Prices", priceSchema);
