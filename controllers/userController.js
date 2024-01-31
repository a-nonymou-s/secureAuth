const { default: generateToken } = require("../middlewares/generateJWT");
const User = require("../models/User");
const bcrypt = require('bcrypt');
const register = async (req, res) => {
    const { name, email, password } = req.body;
    try{
        const us = await User.findOne({email: email});
        if(us){
            return res.status(403).send({
                error: true,
                message: "Email already in use"
            })
        };
        const hash = bcrypt.hash(password, 10)
        const user = new User({name: name, email: email, password: hash, isVerified: false});
        user.save().then((response) => {
            return res.status(201).send({
                error: false,
                success: true,
                result: response,
                message: "user created successfully, please check your email for verification."
            })
        }).catch(err => {
            return res.status(500).send({
                error: true,
                message: `Internal Server Error : ${err}`
            })
        });
    } catch(err) {
        return res.status(500).send({
            error: true,
            message: `Internal Server Error : ${err}`
        })
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;
    try{
        const us = await user.findOne({ email: email });
        if(!us){
            return res.status(403).send({
                error: true,
                message: "Authentication Failed, Email Not Found"
            });
        }
        if(bcrypt.compare(password, us.password)){
        const token = generateToken(us);
        return res.status(200).send({
            accessToken: token,
            userID: user._id,
            message: "Logged In Successfully"
        })
        }
    } catch(err) {
        return res.status(500).send({
            error: true,
            message: `Internal Server Error : ${err}`
        })
    }
}