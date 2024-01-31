const { generateToken, decodeToken } = require("../middlewares/tokenHandler");
const sendmail = require('../middlewares/sendMail');
const User = require("../models/User");
const bcrypt = require('bcrypt');
const register = async (req, res) => {
    const { name, email, password } = req.body;
    try{
        const us = await User.findOne({email: email});
        if(us){
            return res.status(403).json({
                error: true,
                message: "Email already in use"
            })
        };
        const hash = await bcrypt.hash(password, 10)
        const user = new User({name: name, email: email, password: hash, isVerified: false});
        const token = generateToken({name: name, email: email, password: hash, isVerified: false});
        sendmail(email, "Email Confirmation", `Click <a href="http://localhost:${process.env.PORT}/auth/verify/${token}">here in order to verify your email.`)
        user.save().then((response) => {
            return res.status(201).json({
                error: false,
                success: true,
                result: response,
                message: "user created successfully, please check your email for verification."
            })
        }).catch(err => {
            return res.status(500).json({
                error: true,
                message: `Internal Server Error : ${err}`
            })
        });
    } catch(err) {
        return res.status(500).json({
            error: true,
            message: `Internal Server Error : ${err}`
        })
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;
    try{
        const us = await User.findOne({ email: email });
        if(!us){
            return res.status(403).json({
                error: true,
                message: "Authentication Failed, Email Not Found"
            });
        }
        if(bcrypt.compare(password, us.password)){
        const token = generateToken({name: us.name, email: us.email, password: us.password, isVerified: us.isVerified});
        return res.status(200).json({
            accessToken: token,
            userID: us._id,
            message: "Logged In Successfully"
        })
        }
    } catch(err) {
        return res.status(500).json({
            error: true,
            message: `Internal Server Error : ${err}`
        })
    }
}

const verifyEmail = async (req, res) => {
    try {
        const token = req.params.token;
        const decoded = decodeToken(token);
        const user = await User.findOne({ email: decoded.email });
        user.isVerified = true;
        await user.save();
        return res.status(200).json({
            error: false,
            message: "Email Verified Successfully"
        })
    } catch(err) {
        return res.status(500).json({
            error: true,
            message: `Internal Server Error : ${err}`
        })
    };
}
const sendResetPassword = async (req, res) => {
    try{
    const token = req.header('Authorization').toString().replace('Bearer ', '');
    const decoded = decodeToken(token);
    sendmail(decoded.email, "Password Reset", `Click <a href="http://localhost:${process.env.PORT}/auth/reset/${token}">here in order to reset your pasword.`)
    return res.status(200).json({
        error: false,
        message: 'Password Reset Link Successfully Sent.'
    })    
} catch(err) {
    return res.status(500).json({
        error: true,
        message: `Internal Server Error : ${err}`
    })
}
}
const resetPassword = async (req, res) => {
    try {
        const token = req.params.token;
        const decoded = decodeToken(token);
        const user = await User.findOne({ email: decoded.email });
        const { newPassword } = req.body;
        const hash = await bcrypt.hash(newPassword, 10);
        user.password = hash;
        await user.save();
        return res.status(200).json({
            error: false,
            message: "Password Changed Successfully"
        })
    } catch(error) {
        return res.status(500).json({
            error: true,
            message: `Internal Server Error : ${err}`
        })
    };
}

module.exports = {
    register,
    login,
    verifyEmail,
    resetPassword,
    sendResetPassword
}