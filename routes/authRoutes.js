const express = require('express');
const router = express.Router();
const { register, login, verifyEmail } = require('../controllers/userController')
router.post('/login', login);
router.post('/register', register);
router.put('/verify/:token', verifyEmail)
module.exports = router;