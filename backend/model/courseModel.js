const { request } = require("express");
const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const crypto = require("crypto")

const courseSchema = mongoose.Schema({
    
    name:{
        type:"String",
        required:true
    },
    desc:{
        type:"String",
        default:false
    } ,
    image:{
        type:"String",
        required:true
    },
    price:{
        type: Number,
        required:true
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
 
})


 
module.exports = mongoose.model('course' , courseSchema)

