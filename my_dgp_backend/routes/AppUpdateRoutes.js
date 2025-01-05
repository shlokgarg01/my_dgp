const express = require("express");
const { isAuthenticatedUser } = require("../middleware/Auth");
require("../controllers/AddressController");
const { getMyDgpTeamAppUpdate } = require("../controllers/AppUpdateController");
const router = express.Router();

router.route("/app-update/team").get(isAuthenticatedUser,getMyDgpTeamAppUpdate);

module.exports = router;
