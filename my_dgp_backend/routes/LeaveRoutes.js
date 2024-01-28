const express = require("express");
const router = express.Router();
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/Auth");
const {
  applyLeave,
  getPendingLeaves,
  getLeavesofUser,
  updateLeaveStatus,
} = require("../controllers/LeaveController");
const Enums = require("../utils/Enums");

router.route("/leave/new").post(isAuthenticatedUser, applyLeave);
router.route("/leave/all").get(isAuthenticatedUser, getLeavesofUser);
router
  .route("/admin/leave/pending")
  .get(
    isAuthenticatedUser,
    authorizeRoles(Enums.USER_ROLES.ADMIN),
    getPendingLeaves
  );
router
  .route("/admin/leave/update/:id")
  .put(
    isAuthenticatedUser,
    authorizeRoles(Enums.USER_ROLES.ADMIN),
    updateLeaveStatus
  );

module.exports = router;
