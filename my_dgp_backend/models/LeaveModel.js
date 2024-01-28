const mongoose = require("mongoose");
const Enums = require('../utils/Enums')

const leaveModel = new mongoose.Schema(
  {
    serviceProvider: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true
    },
    reason: {
      type: String,
      required: false
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    days: {
      type: Number,
      required: true
    },
    status: {
      type: String,
      required: true,
      default: Enums.LEAVE_STATUS.PENDING,
    }
  },
  {
    timestamps: {
      createdAt: "createdAt",
      updatedAt: "updatedAt",
    },
  }
);

module.exports = mongoose.model("Leave", leaveModel);
