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

const addressSchema = new mongoose.Schema({
    addressLine1: {
        type: String,
        required: false,
        default: '',
    },
    addressLine2: {
        type: String,
        required: false,
        default: '',
    }
})

const customerSchema = new mongoose.Schema(
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
        status: {
            type: String,
        },
        accountDetails: accountDetailsSchema,
        addressSchema:addressSchema,
    },
    {
        timestamps: {
            createdAt: "createdAt",
            updatedAt: "updatedAt",
        },
    }
);

module.exports = mongoose.model("Customer", customerSchema);
