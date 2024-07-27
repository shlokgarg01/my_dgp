const DeliveryRequest = require("../models/DeliveryModel");
const catchAsyncErrors = require("../middleware/CatchAsyncErrors");
const ErrorHandler = require("../utils/errorHandler");
const Enums = require("../utils/Enums")

// create delivery request
exports.createDeliveryRequest = catchAsyncErrors(async (req, res) => {
    try {
        const { _id, deliveryUrl, contactNumber, isApproved } = req.body;

        // Check if _id is provided and is a string
        if (!_id || typeof _id !== 'string') {
            return res.status(400).json({ error: 'Invalid or missing _id' });
        }

        // Create and save the new request
        const newRequest = new DeliveryRequest({ _id, deliveryUrl, contactNumber, isApproved });
        await newRequest.save();
        res.status(201).json(newRequest);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// Get delivery request by ID
exports.getDeliveryRequest = catchAsyncErrors(async (req, res) => {
    try {
        const request = await DeliveryRequest.findById(req.params.id);
        if (!request) {
            return res.status(404).json({ message: 'Delivery not found' });
        }
        // On success, return the document with status 200
        res.status(200).json(request);
    } catch (error) {
        // Handle potential errors and return a 500 status code
        res.status(500).json({ error: error.message });
    }
});