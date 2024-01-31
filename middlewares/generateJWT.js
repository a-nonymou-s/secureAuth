const jwt = require('jsonwebtoken');
require('dotenv').config();
export default function generateToken(data){
    return jwt.sign(data, process.env.JWT);
}
