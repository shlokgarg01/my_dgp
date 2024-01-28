const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("./CatchAsyncErrors");
const jwt = require('jsonwebtoken')
const User = require('../models/UserModel')

exports.isAuthenticatedUser = catchAsyncErrors(async (req, res, next) => {
  // let {token} = req.cookies
  let token = null
  if (token === null || token === undefined) {
    token = req.headers['authorization']
  }

  if(!token) {
    return next(new ErrorHandler("Please login to access this resource.", 401))
  }

  const decodedData = jwt.verify(token, process.env.JWT_SECRET)
  req.user = await User.findById(decodedData.id)
  next()
})

exports.authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if(!roles.includes(req.user.role)) {
      return next(new ErrorHandler(`Role: ${req.user.role} is not allowed to access this resource`, 403))
    }

    next()
  }
}