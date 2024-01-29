const catchAsyncErrors = require('../middleware/catchAsyncErrors');
const notificationModel = require('../model/notificationModel');
const userModel = require('../model/userModel')
const sendEmail = require('../utils/sendEmail')


exports.getNotification = catchAsyncErrors(async (req, res, next) => {
    try {
        // Find users whose "checkoutPage" is true and "paid" is false
        const users = await notificationModel.find({ to:req.user._id});

        console.log('users_Nodemailer:', users);
        if (users.length === 0) {
            return res.status(200).json({ status: false, message: "no user found" });
        }

        res.status(200).json({ message: "Email sent to users who haven't purchased", data: users ,status:true});
    } catch (error) {
        console.error('Error sending email:', error); 
        res.status(500).json({ message: 'Internal server error' });
    }
});
