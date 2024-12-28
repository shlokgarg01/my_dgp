const express = require("express");

const { isAuthenticatedUser } = require("../middleware/Auth");
const { createDriveFolder } = require("../controllers/DriveApiController");
const router = express.Router();

router.route("/drive/createFolder").post(createDriveFolder);

module.exports = router;
