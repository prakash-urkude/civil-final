const nodeMailer = require("nodemailer");

const sendEmail = async (options) => {
  const transporter = nodeMailer.createTransport({
    
    service: 'Gmail',
    auth: {
      user: process.env.SMPT_MAIL,
      pass: process.env.SMPT_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.SMPT_MAIL,
    to: options.email,
    subject: options.subject,
    text: options.message,
  };
// console.log("mailOptions:", mailOptions)
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
