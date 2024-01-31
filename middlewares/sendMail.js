const nodemailer = require('nodemailer');
require('dotenv').config();
export default async function sendmail(email, subject, text){
    try {
        const mailOptions = {
            from: process.env.GUSER,
            to : email,
            subject: subject,
            html: text
        };
        const Transporter = nodemailer.createTransport({
            service: "gmail",
            auth:  {
                user: process.env.GUSER,
                pass: process.env.GPASS
            },   
        });
        await Transporter.sendMail(mailOptions);
    }catch(err){
        console.log(err);
    }
}