const mongoose = require("mongoose");
const Enums = require("../utils/Enums");

const appUpdateSchema = new mongoose.Schema(
    {
        _id: { type: mongoose.Schema.Types.ObjectId },
        min_supported_version: { type: String },
        title: { type: String},
        subTitle: { type: String }
    }
);

module.exports = mongoose.model('MyDgpTeamAppUpdates', appUpdateSchema);