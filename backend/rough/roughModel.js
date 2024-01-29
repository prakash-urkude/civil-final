const mongoose  = require('mongoose')
const userSchema = new mongoose.Schema({
    name:{
        type:'String',
        require :true
    },
    password:{
        type:'String',
        require :true
    },
   product:{
    type:mongoose.Schema.ObjectId,
    ref:'product',
    require : true
   }
    ,
    resetPasswordToken:String,
    resetPasswordExpire:String
})


userSchema.pre("save" , async function(next){
    if(!this.isModified("password")){
        next();
    }
    this.password = await bcrypt.hash(this.password ,10)
})

userSchema.methods.comparePassword = async function (password){
    return await bcrypt.compare(password , this.password)
}

userSchema.methods.getResetPasswordToken =async function (){
    const resetToken = crypto.rendomBytes(20).toString("hex")
    this.resetPasswordToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex")

    this.resetPasswordExpire = Date.now() + 15 *60 *60 *1000
    return resetToken
}


module.exports = mongoose.Model('User' , userSchema)
