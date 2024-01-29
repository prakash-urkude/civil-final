const express = require("express")
const mongoose= require("mongoose")
const cookieParser = require("cookie-parser")
const fileupload = require("file-upload")
const userModel = require("../model/userModel");
const sendToken = require("./roughutils");

const app = express()
app.use(express.json({limit:"50mb"}))
app.use(express.urlencoded({limit:'50mb', extended:true}))
app.use(cookieParser())

// mongoose.connect("")
// .then(() =>{console.log('db connected')})
// .catch((error) =>{console.log(error)})

// js
// Higher-Order Function to Handle Try-Catch
const asyncHandler = (asyncFunction) => {
  return async (req, res, next) => { 
    try {
      await asyncFunction(req, res, next);
    } catch (error) {
      res.status(500).json({ msg: 'Server error', status: false });
    }
  };
}; 

app.post('/register' ,  asyncHandler(async (req, res, next) => {
  const { name, password ,email} = req.body;
  const created = await userModel.create({ name, password,email });
  sendToken(created, 201, res);
}))
  
  // Original Functions Using the HOF

  // //register
  // exports.registerUser = asyncHandler(async (req, res, next) => {
  //   const { name, password ,email} = req.body;
  //   const created = await userModel.create({ name, password,email });
  //   sendToken(created, 201, res);
  // });

   //login
   exports.login = asyncHandler(async (req, res, next) => {
    const { email , password } = req.body;
    const user = await userModel.find({ email: email }).select("+password");

    if(!user){return res.status(400).json({msg:'No User Present With This Email '})}
    const isPasswordMatched = await user.comparePassword(password)

    if(!isPasswordMatched){
        return res.status(400).json({msg:'invalid email or password'})
    }

    sendToken(user , 200 , res)
  });

  //getUserDetails
  exports.getUserDetails = asyncHandler(async (req, res, next) => {
    const { email } = req.body;
    const userAll = await userModel.find({ email: email });
    return res.status(200).json({ data: userAll, status: true });
  });
  
  exports.updateUser = asyncHandler( async (req,res,next) => {
    const id =req.params.id
    const {name , avatar} = req.body
    const data ={};
    if(name){data['name'] = name}
    if(avatar){data['avatar'] = avatar}

    const updated = await userModel.findByIdAndUpdate(
        {_id:id},{data},{new:true , upsert:true}
    )
    return res.status(200).json({status:true, data:updated , msg:"updated"})
  })

  exports.deleteUser = asyncHandler(async function(req,res,next){
    const id =req.params.id
    
    await userModel.findByIdAndDelete(
        {_id:id},{data},{new:true , upsert:true}
    )
    return res.status(204).json({status:true,  msg:"Deleted"})
  })
   
  exports.logout = asyncHandler(async function(req,res,next){
     res.cookie('token' ,null, {
        expire: new Date(Date.now),
        httpOnly:true
    })

    return res.status(200).json({
        success:true,
        message:'Logged Out'
    })
  })
      
  
  exports.forgotPassword = asyncHandler(async function(req,res,next){
    const user = await userModel.findOne({email:req.body.email})

    if(!user){return res.status(400).json({status:false,  msg:"Invalid Email"})}
    const token = user.getResetPasswordToken()
//link
  })

exports.resetPassword = asyncHandler(async function(req,res,next){
    
})


app.listen(4000,()=>{
  console.log('connected server')
})