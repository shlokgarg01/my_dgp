const mongoose = require("mongoose");

const bookingRequestsSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    serviceProvider: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    service: {
      type: mongoose.Schema.ObjectId,
      ref: 'Service',
      required: true
    },
    booking: {
      type: mongoose.Schema.ObjectId,
      ref: "Booking",
      required: true,
    },
    address: {
      type: mongoose.Schema.ObjectId,
      ref: 'Address',
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

module.exports = mongoose.model("BookingRequest", bookingRequestsSchema);
