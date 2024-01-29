const express =  require("express")
const userModel  = require('../model/userModel')
const catchAsyncErrors = require('../middleware/catchAsyncErrors')
const sendToken = require("../utils/jwtToken")
const ErrorHandler = require("../utils/errorHandler")
exports.registerUser = catchAsyncErrors (async(req,res,next) =>{
    const {name ,age,password, image , dob, email , title } = req.body

    const user = await userModel.create({
        title,
        name,
        email,
        image,
        dob,
        password,
        age
    })
    
    sendToken(user , 201, res)
})

exports.loginUser = catchAsyncErrors( async (req,res,next) =>{
    const {email , password} = req.body ;
    
    if(!email || !password){

        return next(new ErrorHandler("Please Enter Email & Password", 400));
    }
    const user = await userModel.findOne({email:email}).select("+password")
    
    if (!user) {
        return next(new ErrorHandler("Invalid email or password", 401));
      }

      const isPasswordMatched = await user.comparePassword(password)
      
      if(!isPasswordMatched){
        return next(new ErrorHandler("Invalid email or password" ,401))
      }
      sendToken(user , 200, res)

})

exports.getAll = catchAsyncErrors(async(req,res,next) => {
    const users = await userModel.find()
    res.status(200).json({message:"all users" , data:users})
})

exports.getUserDetails = catchAsyncErrors(async (req, res, next) => {
    const user = await userModel.findById(req.user.id);
  
    res.status(200).json({
      success: true,
      user,
    });
  });

  exports.getUserDetails = catchAsyncErrors(async (req, res, next) => {
    const user = await userModel.findById(req.user.id);
  
    res.status(200).json({
      success: true,
      user,
    });
  });


  exports.updateUser = catchAsyncErrors(async (req,res,next) =>{
    const {name,dob,image,age}=  req.body
    const newUserData ={}

       if(name){ newUserData["name"] = name}
        if(dob){ newUserData["dob"]  = dob}
        if(image){newUserData["image"]  = image}
        if(age){newUserData["age"]  = age}

    const updated = await userModel.findByIdAndUpdate(req.user.id , newUserData , {
        new:true,
        runValidators: true,
    useFindAndModify: false,

    })
    return res.status(200).json({data:updated , msg:'updated'})
  })

  //Yes, you can use the .save() method to achieve a similar update operation in Mongoose. The .save() method is typically used when you already have an instance of a document, and you want to modify specific fields on that document before saving it back to the database.
  exports.updateUserStatus = catchAsyncErrors(async (req,res,next) =>{
    
    const { checkoutPage, paid } = req.body;

  // Handle the data as needed (e.g., update user status)
  const updatedUser = await userModel.findByIdAndUpdate(req.user.id, { checkoutPage, paid }, {
    new: true,
    runValidators: true,
    useFindAndModify: false
  });

  // Send response back to frontend
  res.status(200).json({ data: updatedUser, msg: 'User status updated successfully' });
  })

  exports.deleteUser = catchAsyncErrors(async (req,res,next) =>{
   
// console.log("req.user_83:",req.user)
    const deleted = await userModel.findByIdAndDelete(req.user.id)
    return res.status(204).json({Message:"Deleted"})
  })

  

  