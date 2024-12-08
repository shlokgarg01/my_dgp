
const ReviewModel = require("../models/ReviewModel");
  
exports.createReview = async (req, res, next) => {
    try {
        const { stars, comment, givenBy, customer, rider, booking, bookingId } = req.body;

        // Validate required fields
        if (!stars || !givenBy || !customer || !booking || !bookingId) {
            return res.status(400).json({
                success: false,
                message: 'All required fields must be provided.',
            });
        }

        // Create and save the review
        let review = await ReviewModel.create({
            stars,
            comment,
            givenBy,
            customer,
            rider,
            booking,
            bookingId,
        });

        // Format response object with reviewId
        review = {
            reviewId: review._id,
            ...review.toObject(),
        };

        res.status(201).json({
            success: true,
            review,
        });
    } catch (error) {
        // Generic error handler
        res.status(500).json({
            success: false,
            message: 'An error occurred while creating the review.',
            error: error.message,
        });
    }
};
