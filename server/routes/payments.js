const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const paymentController = require('../controllers/paymentController');

// GET /api/payments/config (Public, to get Key ID)
router.get('/config', (req, res) => {
    res.json({ key: process.env.RAZORPAY_KEY_ID });
});

// POST /api/payments/create-order
router.post('/create-order', protect, paymentController.createOrder);

// POST /api/payments/verify-payment
router.post('/verify-payment', protect, paymentController.verifyPayment);

module.exports = router;
