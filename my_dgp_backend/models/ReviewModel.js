const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
    stars: {
        type: Number, required: true, min: 1, max: 5
    },
    comment: { type: String, required: false },
    givenBy: { type: String, required: false },
    bookingId: { type: String, required: true },
    booking: { type: mongoose.Schema.ObjectId, ref: 'Booking', required: true },
    customer: { type: mongoose.Schema.ObjectId, ref: 'User', required: true },
    rider: { type: mongoose.Schema.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

module.exports = mongoose.model('Review', reviewSchema);
