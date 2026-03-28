const Razorpay = require('razorpay');
const crypto = require('crypto');
const Booking = require('../models/Booking');
const Event = require('../models/Event');
const { sendBookingEmail } = require('../utils/email');

// Initialize Razorpay Instance
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

exports.createOrder = async (req, res) => {
    try {
        const { bookingId } = req.body;
        
        const booking = await Booking.findById(bookingId).populate('eventId');
        if (!booking) return res.status(404).json({ message: 'Booking not found' });
        
        // Amount must be in the smallest currency unit (paise) i.e. multiplied by 100
        const amountInPaise = booking.amount * 100;
        
        const options = {
            amount: amountInPaise,
            currency: 'INR',
            receipt: `receipt_booking_${booking._id}`,
        };

        const order = await razorpay.orders.create(options);
        if (!order) return res.status(500).json({ message: 'Failed to create Razorpay order' });

        res.json({
            message: 'Order created successfully',
            orderId: order.id,
            amount: order.amount,
            currency: order.currency,
        });

    } catch (error) {
        console.error('Error in createOrder:', error);
        res.status(500).json({ message: 'Failed to process payment creation', error: error.message });
    }
};

exports.verifyPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, bookingId } = req.body;

        // Create the expected signature using Crypto
        const generated_signature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(razorpay_order_id + "|" + razorpay_payment_id)
            .digest('hex');

        // Check if the signature matches to verify authenticity
        if (generated_signature !== razorpay_signature) {
            return res.status(400).json({ message: 'Payment verification failed: Invalid Signature' });
        }

        // If verified, update the booking to 'confirmed' and 'paid'
        const booking = await Booking.findById(bookingId).populate('userId').populate('eventId');
        if (!booking) return res.status(404).json({ message: 'Booking not found' });

        booking.status = 'confirmed';
        booking.paymentStatus = 'paid';
        await booking.save();

        // Deduct the seat from the event
        const event = await Event.findById(booking.eventId._id);
        if (event) {
            event.availableSeats -= 1;
            await event.save();
        }

        // Send a confirmation email to the user 
        await sendBookingEmail(booking.userId.email, booking.userId.name, booking.eventId.title);

        res.json({ message: 'Payment verified and booking confirmed successfully!' });
    } catch (error) {
        console.error('Error in verifyPayment:', error);
        res.status(500).json({ message: 'Failed to verify payment', error: error.message });
    }
};
