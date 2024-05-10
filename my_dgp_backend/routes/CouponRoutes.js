const express = require("express");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/Auth");
const {
  getAllCoupons,
  createCoupon,
  getCouponDetails,
  deleteCoupon,
  updateCoupon,
  validateCoupon,
} = require("../controllers/CouponController");
const router = express.Router();

router
  .route("/admin/coupons")
  .get(isAuthenticatedUser, authorizeRoles("admin"), getAllCoupons);
router
  .route("/admin/coupon/new")
  .post(isAuthenticatedUser, authorizeRoles("admin"), createCoupon);
router
  .route("/admin/coupon/:id")
  .get(isAuthenticatedUser, authorizeRoles("admin"), getCouponDetails)
  .put(isAuthenticatedUser, authorizeRoles("admin"), updateCoupon)
  .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteCoupon);
router.route("/coupon/validate").post(isAuthenticatedUser, validateCoupon);

module.exports = router;