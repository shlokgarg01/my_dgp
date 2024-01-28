const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const Enums = require("../utils/Enums");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter your name"],
      maxLength: [40, "Name cannot exceed 40 characters"],
    },
    email: {
      type: String,
      required: false,
      default: "dummyemail@mydgp.com",
      unique: true,
      validate: [validator.isEmail, "Please enter a valid email"],
    },
    avatar: {
      public_id: {
        type: String,
      },
      url: {
        type: String,
      },
    },
    contactNumber: {
      type: String,
      required: [true, "Please enter your Contact Number."],
      unique: true,
      validate: {
        validator: function (number) {
          var regex = /^[1-9][0-9]{9}$/g;
          return !number || !number.trim().length || regex.test(number);
        },
        message: "Provided Contact Number is invalid.",
      },
    },
    avatar: {
      public_id: {
        type: String,
        // required: true,
      },
      url: {
        type: String,
        // required: true,
      },
    },
    role: {
      type: String,
      default: Enums.USER_ROLES.USER,
    },
    service: {
      type: mongoose.Schema.ObjectId,
      ref: "Service",
      required: false,
    },
    status: {
      type: String,
    },
    totalEarnings: {
      type: Number,
      required: false,
      default: 0,
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  {
    timestamps: {
      createdAt: "createdAt",
      updatedAt: "updatedAt",
    },
  }
);

// JWT Token creation
userSchema.methods.getJWTToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// service is required for role === service_provider
userSchema.pre("save", function (next) {
  if (
    this.role === Enums.USER_ROLES.SERVICE_PROVIDER &&
    (this.service === "" || this.service === undefined)
  ) {
    error = new Error("Service is required");
    next(error);
  }

  this.status =
    this.role === Enums.USER_ROLES.SERVICE_PROVIDER
      ? Enums.SERVICE_PROVIDER_STATUS.INACTIVE
      : Enums.SERVICE_PROVIDER_STATUS.ACTIVE;

  next();
});

module.exports = mongoose.model("User", userSchema);
