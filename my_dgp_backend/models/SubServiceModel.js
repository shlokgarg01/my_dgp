const mongoose = require("mongoose");

const subServiceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    service: {
      type: mongoose.Schema.ObjectId,
      ref: "Service",
      required: true,
    },
    demoLinks: [
      {
        type: String,
        required: false,
      },
    ],
  },
  {
    timestamps: {
      createdAt: "createdAt",
      updatedAt: "updatedAt",
    },
  }
);

module.exports = mongoose.model("SubService", subServiceSchema);
