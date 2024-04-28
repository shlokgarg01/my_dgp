const express = require("express");
const router = express.Router();
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/Auth");
const { createPrice, editPrice, getPrices } = require("../controllers/PriceController");

router
  .route("/price/new")
  .post(isAuthenticatedUser, authorizeRoles("admin"), createPrice);
router
  .route("/price/edit/:id")
  .put(isAuthenticatedUser, authorizeRoles("admin"), editPrice);
router
  .route("/prices")
  .get(isAuthenticatedUser, authorizeRoles("admin"), getPrices);

module.exports = router;