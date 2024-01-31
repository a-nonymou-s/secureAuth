const jwt = require('jsonwebtoken');
require('dotenv').config();

const generateToken = (data) => jwt.sign(data, process.env.JWT);
const decodeToken = (token) => jwt.decode(token, process.env.JWT);

module.exports = {
    generateToken,
    decodeToken
};
