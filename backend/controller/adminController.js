const catchAsyncErrors = require('../middleware/catchAsyncErrors')
const userModel = require('../model/userModel')
const sendEmail = require('../utils/sendEmail')
const notificationModel = require('../model/notificationModel') 

exports.sendMailNotActiveUser = catchAsyncErrors(async (req, res, next) => {
    // Find users who have been inactive for more than 5 days
    const fiveDaysAgo = new Date();
    fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5);

    // console.log('fiveDaysAgo_10:' ,fiveDaysAgo.getDate()> Date.now()? true:false ) ;
    
    const inactiveUsers = await userModel.find({ LastSeen: { $lt: fiveDaysAgo } });
// console.log('inactiveUsers_12:' ,inactiveUsers) 

if (inactiveUsers.length === 0) {
    return res.status(200).json({ status: false, message: "No inactive users found" });
}
    // Loop through the inactive users and send an email to each
    for (const user of inactiveUsers) {

        await notificationModel.create({
            to: user._id, // Assuming to field is the user's ObjectId
            title: 'Reminder: Check Out Our Sale',
            message: `Hey ${user.name || 'there'},\n\nHaven't seen you around for a while! Don't miss out on our sale. Check out the latest deals and make your purchase today.\n\nBest regards,\nThe Let's Buy Team`
        });

        await sendEmail({
            email: user.email,       
            subject: `Reminder: Check Out Our Sale`,
            message: `Hey ${user.name || 'there'},\n\nHaven't seen you around for a while! Don't miss out on our sale. Check out the latest deals and make your purchase today.\n\nBest regards,\nThe Let's Buy Team`
        });
    }

    res.status(200).json({ message: "Reminder: Check Out Our Sale", data: inactiveUsers , status:true });
}); 


exports.sendMailAllNotPurchasedUser = catchAsyncErrors(async (req, res, next) => {
    try {
        // Find users whose "checkoutPage" is true and "paid" is false
        const users = await userModel.find({ checkoutPage: true, paid: false });

        // console.log('users_Nodemailer:', users);
        if (users.length === 0) {
            return res.status(200).json({ status: false, message: "checkout the sale and Buy now" });
        }
        // Loop through the users and send an email to each
        for (const user of users) {  

            await notificationModel.create({
                to: user._id, // Assuming to field is the user's ObjectId
                title: "Let's Buy",
                message: 'Hey, checkout the sale and Buy now',
            });

            await sendEmail({
                email: user.email,
                subject: `Lets Buy`,
                message: 'Hey , checkout the sale and Buy now', // Replace with your email message  
            });
        }   

        res.status(200).json({ message: "Email sent to users who haven't purchased", data: users ,status:true});
    } catch (error) {
        console.error('Error sending email:', error); 
        res.status(500).json({ message: 'Internal server error' });
    }
});
