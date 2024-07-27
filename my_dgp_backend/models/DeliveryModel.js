const mongoose = require("mongoose");

const deliverySchema = new mongoose.Schema({
    _id: String,
    deliveryUrl: String,
    contactNumber: String,
    isApproved: Boolean
});

module.exports = mongoose.model('DeliveryRequest', deliverySchema);