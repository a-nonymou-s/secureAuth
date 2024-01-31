const express = require('express');
const router = express.Router();
const { register, login, verifyEmail, resetPassword, sendResetPassword } = require('../controllers/userController')
router.post('/login', login);
router.post('/register', register);
router.get('/resetpassword', sendResetPassword);
router.get('/verify/:token', verifyEmail);
router.post('/reset/:token', resetPassword);
module.exports = router;