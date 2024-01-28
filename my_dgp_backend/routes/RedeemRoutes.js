const express = require("express");
const { isAuthenticatedUser } = require("../middleware/Auth");
const { getRedeemDetails } = require("../controllers/RedeemController");

const router = express.Router();
router.route("/redeem").get(isAuthenticatedUser, getRedeemDetails);

module.exports = router;