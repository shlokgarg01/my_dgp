const ErrorHandler = require('../utils/errorHandler'); 
const catchAsyncErrors = require("../middleware/CatchAsyncErrors");
const appUpdateSchema = require('../models/AppUpdateModel'); 


// get the single document from myDgpTeamAppUpdate
exports.getMyDgpTeamAppUpdate = catchAsyncErrors(async (req, res, next) => {
    try {
        const response = await appUpdateSchema.findOne() 
        if (!response) {
            return next(new ErrorHandler("Data not found", 404));
        }

        res.status(200).json({
            success: true,
            response,
        });
    } catch (error) {
        return next(new ErrorHandler(error.message, 500)); // Handle any errors that occur during the database operation
    }
});

