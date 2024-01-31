const { generateToken, decodeToken } = require("../middlewares/tokenHandler");
const sendmail = require('../middlewares/sendMail');
const User = require("../models/User");
const bcrypt = require('bcrypt');
const Joi = require('joi');

const register = async (req, res) => {
    const { name, email, password } = req.body;

    const schema = Joi.object({
        name: Joi.string().required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required()
    });

    try {
        const { error } = schema.validate({ name, email, password });
        if (error) {
            return res.status(400).json({
                error: true,
                message: error.details[0].message
            });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(403).json({
                error: true,
                message: "Email already in use"
            });
        }

        const hash = await bcrypt.hash(password, 10);
        const user = new User({ name, email, password: hash, isVerified: false });
        const token = generateToken({ name, email, password: hash, isVerified: false });
        sendmail(email, "Email Confirmation", `Click <a href="http://localhost:${process.env.PORT}/auth/verify/${token}">here in order to verify your email.`);

        const response = await user.save();
        return res.status(201).json({
            error: false,
            success: true,
            result: response,
            message: "User created successfully, please check your email for verification."
        });
    } catch (err) {
        return res.status(500).json({
            error: true,
            message: `Internal Server Error: ${err}`
        });
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const schema = Joi.object({
            email: Joi.string().email().required(),
            password: Joi.string().min(6).required()
        });

        const { error } = schema.validate({ email, password });
        if (error) {
            return res.status(400).json({
                error: true,
                message: error.details[0].message
            });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(403).json({
                error: true,
                message: "Authentication Failed, Email Not Found"
            });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (passwordMatch) {
            const token = generateToken({ name: user.name, email: user.email, password: user.password, isVerified: user.isVerified });
            return res.status(200).json({
                accessToken: token,
                userID: user._id,
                message: "Logged In Successfully"
            });
        }
    } catch (err) {
        return res.status(500).json({
            error: true,
            message: `Internal Server Error: ${err}`
        });
    }
};

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
        });
    } catch (err) {
        return res.status(500).json({
            error: true,
            message: `Internal Server Error: ${err}`
        });
    }
};

const sendResetPassword = async (req, res) => {
    try {
        const token = req.header('Authorization').toString().replace('Bearer ', '');
        const decoded = decodeToken(token);
        sendmail(decoded.email, "Password Reset", `Click <a href="http://localhost:${process.env.PORT}/auth/reset/${token}">here in order to reset your password.`);
        return res.status(200).json({
            error: false,
            message: 'Password Reset Link Successfully Sent.'
        });
    } catch (err) {
        return res.status(500).json({
            error: true,
            message: `Internal Server Error: ${err}`
        });
    }
};

const resetPassword = async (req, res) => {
    try {
        const token = req.params.token;
        const decoded = decodeToken(token);
        const user = await User.findOne({ email: decoded.email });

        const schema = Joi.object({
            newPassword: Joi.string().required().min(6)
        });

        const { error } = schema.validate(req.body);
        if (error) {
            return res.status(400).json({
                error: true,
                message: error.details[0].message
            });
        }

        const { newPassword } = req.body;
        const hash = await bcrypt.hash(newPassword, 10);
        user.password = hash;
        await user.save();
        return res.status(200).json({
            error: false,
            message: "Password Changed Successfully"
        });
    } catch (err) {
        return res.status(500).json({
            error: true,
            message: `Internal Server Error: ${err}`
        });
    }
};

module.exports = {
    register,
    login,
    verifyEmail,
    resetPassword,
    sendResetPassword
};
