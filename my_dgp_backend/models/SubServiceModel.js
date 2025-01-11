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
    packages: [
      {
        _id: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
        },
        name: {
          type: String,
          required: true,
        },
        charges: {
          type: Number,
          required: true,
        },
        isCashEnabled: {
          type: Boolean,
          required: true,
        },
        isNowEnabled: {
          type: Boolean,
          required: true,
        },
        isOnlinePaymentEnabled: {
          type: Boolean,
          required: true,
        },
        isOtpRequired: {
          type: Boolean,
          required: true,
        },
        advancePercentage: {
          type: Number,
          required: true,
        },
        description: {
          type: String,
          required: true,
        },
        demoLinks: [
          {
            type: String,
            required: false,
          },
        ],
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
