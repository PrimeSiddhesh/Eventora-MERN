const express = require('express');
const router = express.Router();
const { register, login, verifyOTP, requestLoginOTP, loginWithOTP } = require('../controllers/authController');

router.post('/register', register);
router.post('/login', login);
router.post('/verify-otp', verifyOTP);
router.post('/request-login-otp', requestLoginOTP);
router.post('/login-with-otp', loginWithOTP);

module.exports = router;
