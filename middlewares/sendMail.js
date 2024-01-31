const nodemailer = require('nodemailer');
require('dotenv').config();

const sendMail = async (email, subject, text) => {
    try {
        const mailOptions = {
            from: process.env.GUSER,
            to: email,
            subject: subject,
            html: text
        };
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.GUSER,
                pass: process.env.GPASS
            }
        });
        await transporter.sendMail(mailOptions);
    } catch (err) {
        console.log(err);
    }
};

module.exports = sendMail;
