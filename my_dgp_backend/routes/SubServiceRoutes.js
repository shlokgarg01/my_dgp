const express = require("express");
const router = express.Router();
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/Auth");
const {
  createSubService,
  editSubService,
  getSubServices,
} = require("../controllers/SubServiceController");

router
  .route("/subservice/new")
  .post(isAuthenticatedUser, authorizeRoles("admin"), createSubService);
router
  .route("/subservice/edit/:id")
  .put(isAuthenticatedUser, authorizeRoles("admin"), editSubService);
router
  .route("/subservices")
  .get(isAuthenticatedUser, getSubServices);

module.exports = router;
