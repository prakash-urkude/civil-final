const express = require("express")
const jwt = require("jsonwebtoken")
const catchAsyncErrors = require('./catchAsyncErrors')
const userModel =  require('../model/userModel')
const ErrorHandler = require("../utils/errorHandler")

exports.isAuthenticatedUser = catchAsyncErrors(async(req,res,next) => {
    const {token} = req.cookies;
    // console.log('token_9_auth:' , token)
    if (!token) {
        return next(new ErrorHandler("Please Login to access this resource", 401));
      }

    const decodedData = jwt.verify(token, process.env.JWT_SECRET);
    //  console.log("decodedData:" , decodedData)
    req.user = await userModel.findById(decodedData.id)
 
    next()
}) 

exports.authorizeRoles = (...roles) => {
  return (req, res, next) => {
   
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorHandler(
          `Role: ${req.user.role} is not allowed to access this resouce `,
          403
        )
      );
    }

    next();
  };  
};