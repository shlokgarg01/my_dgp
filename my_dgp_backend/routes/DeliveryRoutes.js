const express = require("express");
const router = express.Router();
const { isAuthenticatedUser } = require("../middleware/Auth");
const { createDeliveryRequest, getDeliveryRequest } = require("../controllers/DeliveryController");

router
    .route("/deliveryRequests/create")
    .post(isAuthenticatedUser, createDeliveryRequest);
router
    .route("/deliveryRequests/:id")
    .get(isAuthenticatedUser, getDeliveryRequest);

module.exports = router;