const express = require("express");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/Auth");
const {
  getAllRedeemRequests,
  createRedeemRequest,
  updateRedeemRequestStatus,
} = require("../controllers/RedeemRequestsController");
const Enums = require("../utils/Enums");

const router = express.Router();
router
  .route("/redeemRequests/all")
  .get(
    isAuthenticatedUser,
    authorizeRoles(Enums.USER_ROLES.ADMIN),
    getAllRedeemRequests
  );

router
  .route("/redeemRequests/new")
  .post(isAuthenticatedUser, createRedeemRequest);
router
  .route("/redeemRequests/updateStatus/:id")
  .post(
    isAuthenticatedUser,
    authorizeRoles(Enums.USER_ROLES.ADMIN),
    updateRedeemRequestStatus
  );

module.exports = router;
