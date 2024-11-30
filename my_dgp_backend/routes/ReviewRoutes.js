const express = require("express");
const { isAuthenticatedUser } = require("../middleware/Auth");
require("../controllers/CouponController");
const { createReview } = require("../controllers/ReviewController");
const router = express.Router();

router
  .route("/reviews/create")
  .post( createReview);
//   .post(isAuthenticatedUser, createReview);

module.exports = router