const catchAsyncErrors = require("../middleware/catchAsyncErrors")
const courseModel = require("../model/courseModel")
const sendToken = require("../utils/jwtToken")

exports.createCourse = catchAsyncErrors(async(req,res,next) =>{
    try{
    const {name ,desc,price, image  } = req.body

    const course = await courseModel.create({
        
        name,
        desc,
        price,
        image,
        
    })
    
    return res.status(201).json({data:course, message:'created' ,status:true})
}catch(error){
    return res.status(500).json({error:error})
}
})

exports.getAllCourse = catchAsyncErrors(async(req,res,next) =>{
    try{
    const course = await courseModel.find()
    
    return res.status(201).json({data:course, message:'sendedAll' ,status:true})
}catch(error){
    return res.status(500).json({error:error})
}
})

exports.getCourse = catchAsyncErrors(async(req,res,next) =>{
    try{
    
const id = req.params.id
    const course = await courseModel.findOne({id})
    
    return res.status(201).json({data:course, message:'sendedAll' ,status:true})
}catch(error){
    return res.status(500).json({error:error})
}
})