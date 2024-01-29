function sendToken (user , statusCode ,res){
    const token = user.getJWTToken()
    options={
        expire:new Date(
            Date.now() + process.env.COOKIE_EXPIRE * 24* 60*60*1000
        ),
        httpOnly:true,
    }
console.log('data')
res.status(statusCode).cookie("token", token ,options).json({
    success:true,
    user,
    token
})
};



module.exports = sendToken ;