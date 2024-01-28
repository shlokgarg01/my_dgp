const express = require("express");
const { isAuthenticatedUser } = require("../middleware/Auth");
const {
  createService,
  updateService,
  deleteService,
  getAllServices,
  getServiceDetails,
} = require("../controllers/ServiceController");
const router = express.Router();

router.route("/service/new").post(isAuthenticatedUser, createService);
router
  .route("/service/:id")
  .put(isAuthenticatedUser, updateService)
  .delete(isAuthenticatedUser, deleteService);
router.route("/services").get(getAllServices);
router.route("/service/:id").get(isAuthenticatedUser, getServiceDetails);

module.exports = router;
