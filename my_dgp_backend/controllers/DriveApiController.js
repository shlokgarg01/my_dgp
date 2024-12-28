const catchAsyncErrors = require("../middleware/CatchAsyncErrors");
const { getDaysFromCreatedAt } = require("../utils/orderUtils");
const { createPublicFolder } = require("../services/googleAPI");

// creates folder on drive of mydgp1@gmail.com
exports.createDriveFolder = catchAsyncErrors(async (req, res) => {
    try {
        const folderName = req.body.folderName;
        const folderData = await createPublicFolder(folderName);
        res.status(200).json(folderData);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
  });

