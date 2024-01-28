const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema(
  {
    label: {
      type: "String",
      required: false
      // required: [true, "Please enter the Address Label."],
    },
    address: {
      type: String,
      required: true,
    },
    landmark: {
      type: "String",
      default: ""
    },
    city: {
      type: String,
      default: ""
      // required: true,
    },
    state: {
      type: String,
      default: ""
      // required: true,
    },
    country: {
      type: String,
      default: "India",
    },
    pincode: {
      type: Number,
      default: ""
      // required: true,
    },
    name: {
      type: String,
      required: [true, "Please enter the name of the contact person"],
      maxLength: [40, "Name cannot exceed 40 characters"],
    },
    contactNumber: {
      type: Number,
      required: true,
      validate: {
        validator: function (number) {
          var regex = /^[1-9][0-9]{9}$/g;
          return !number || regex.test(number);
        },
        message: "Provided Contact Number is invalid.",
      },
    },
    coordinates: {
      lat: {
        type: String,
        required: false,
      },
      lng: {
        type: String,
        required: false,
      },
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: {
      createdAt: "createdAt",
      updatedAt: "updatedAt",
    },
  }
);

module.exports = mongoose.model("Address", addressSchema);
