const nodemailer = require("nodemailer");
require("dotenv").config();

const sendEmail = async (email, subject, text) => {

    const sendEmail = async (option) => {
        const transporter = nodemailer.createTransport({
            service: process.env.HOST,
            port: 465,
            secure: true,
            auth: {
                user: process.env.USER,
                pass: "",
            },
        })
    }

    const emailOptions = {
        from: 'lakefront@mailsire.com',
        to: option.email,
        subject: "Password Reset Link",
        text: "Follow the link below in order to reset your password. Check your spam folder if you can't locate the link", // plain text body
        html: `${link}`,
    }
    
    await transporter.sendMail(emailOptions);
    console.log("email sent sucessfully");
};

module.exports = sendEmail();