const express = require("express");
const router = express.Router();
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/Auth");
const {
  createPackage,
  editPackage,
  getPackages,
} = require("../controllers/PackageController");

router
  .route("/package/new")
  .post(isAuthenticatedUser, authorizeRoles("admin"), createPackage);
router
  .route("/package/edit/:id")
  .put(isAuthenticatedUser, authorizeRoles("admin"), editPackage);
router
  .route("/packages")
  .get(isAuthenticatedUser, authorizeRoles("admin"), getPackages);

module.exports = router;