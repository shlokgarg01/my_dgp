const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const Enums = require("../utils/Enums");

const accountDetailsSchema = new mongoose.Schema({
  accountNo: {
    type: Number,
    required: false,
    default: 0,
  },
  ifscCode: {
    type: String,
    required: false,
    default: '',
  },
  accountHolderName: {
    type: String,
    required: false,
    default: '',
  },
});

const equipmentItemsSchema = new mongoose.Schema({
  val1: {
    type: String,
    required: false,
    default: '',
  },
  val2: {
    type: String,
    required: false,
    default: '',
  },
  val3: {
    type: String,
    required: false,
    default: '',
  },
  val4: {
    type: String,
    required: false,
    default: '',
  },
  val5: {
    type: String,
    required: false,
    default: '',
  },
  val6: {
    type: String,
    required: false,
    default: '',
  },
  val7: {
    type: String,
    required: false,
    default: '',
  },
  val8: {
    type: String,
    required: false,
    default: '',
  },
  val9: {
    type: String,
    required: false,
    default: '',
  },
  val10: {
    type: String,
    required: false,
    default: '',
  },
  val11: {
    type: String,
    required: false,
    default: '',
  },
});

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
      validate: [validator.isEmail, "Please enter a valid email"],
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
      type: String
    },
    fcm_token: {
      type: String,
      default: "",
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
    subServices: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "SubService",
        required: false,
      },
    ],
    packages: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Package",
        required: false,
      },
    ],
    minutesServiced: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
    },
    totalEarnings: {
      type: Number,
      required: false,
      default: 0,
    },
    accountDetails: accountDetailsSchema,
    equipmentDetails: equipmentItemsSchema,
    PortfolioLink: {
      type: String,
      required: false,
      default: '',
    },
    isProfileUpdated: {
      type: Boolean,
      default: false
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
