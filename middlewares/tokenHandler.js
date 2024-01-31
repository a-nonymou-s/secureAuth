const jwt = require('jsonwebtoken');
require('dotenv').config();
function generateToken(data){
    return jwt.sign(data, process.env.JWT);
    
}
function decodeToken(token){
    return jwt.decode(token, process.env.JWT);
}

module.exports = {
    generateToken,
    decodeToken
}