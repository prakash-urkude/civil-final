const { request } = require("express");
const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const crypto = require("crypto")

const userSchema = mongoose.Schema({
    title:{
      type:"String"  ,
      enum: ['Mr', 'Miss', 'Mrs'],
      required: true,
    },
    name:{
        type:"String",
        required:true
    },
    paid:{
        type:Boolean,
        default:false
    } ,
    image:{
        type:"String",
        required:true
    },
    role:{
       type:"String",
        default:"user",
    },
    checkoutPage:{
        type:Boolean,
         default:false,
     },
    token:{
        type:"String",
        
    },
    LastSeen:{
        type: Date,
        default: Date.now,
    },
    email:{
        type:"String" ,
        validate: [validator.isEmail, "Please Enter a valid Email"], //match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        unique: true,
        required:true
    },
    password:{
        type:"String" ,
        select: false,
        required:true
    },

    timestamp: {
        type: Date,
        default: Date.now,
    },
 
})

userSchema.pre("save" , async function(next) {
    if(!this.isModified("password")){
        next()
    }
    this.password = await bcrypt.hash(this.password,10)
})

userSchema.methods.getJWTToken = function(){
    console.log('_id' ,this._id)
    return jwt.sign({id:this._id} , process.env.JWT_SECRET,{
        expiresIn:process.env.JWT_EXPIRE,
    });
    };

    userSchema.methods.comparePassword = async function(password){
      return await bcrypt.compare(password,this.password)  
    }
 
module.exports = mongoose.model('user' , userSchema)

