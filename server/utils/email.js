const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

const sendEmail = async (to, subject, htmlContent) => {
    try {
        const response = await axios.post('https://api.brevo.com/v3/smtp/email', {
            sender: { name: "Eventora", email: process.env.EMAIL_USER },
            to: [{ email: to }],
            subject: subject,
            htmlContent: htmlContent
        }, {
            headers: {
                'api-key': process.env.BREVO_API_KEY,
                'Content-Type': 'application/json'
            }
        });
        console.log('Email sent successfully via Brevo REST API. Message ID:', response.data.messageId);
        return response.data;
    } catch (error) {
        console.error('Error sending email via Brevo API:', error.response ? error.response.data : error.message);
        throw error;
    }
};

const sendBookingEmail = async (userEmail, userName, eventTitle) => {
    const htmlContent = `
        <div style="font-family: sans-serif; padding: 20px;">
            <h2>Hi ${userName}!</h2>
            <p>Your booking for the event <strong>${eventTitle}</strong> is successfully confirmed.</p>
            <p>Thank you for choosing Eventora.</p>
        </div>
    `;
    await sendEmail(userEmail, `Booking Confirmed: ${eventTitle}`, htmlContent);
};

const sendOTPEmail = async (userEmail, otp, type) => {
    const title = type === 'account_verification' 
        ? 'Verify your Eventora Account' 
        : type === 'login' 
            ? 'Login OTP for Eventora'
            : 'Eventora Booking Verification';
            
    const msg = type === 'account_verification'
        ? 'Please use the following OTP to verify your new Eventora account.'
        : type === 'login'
            ? 'Please use the following OTP to log in to your account.'
            : 'Please use the following OTP to verify and confirm your event booking.';

    const htmlContent = `
        <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
            <h2 style="color: #111;">${title}</h2>
            <p style="color: #555; font-size: 16px;">${msg}</p>
            <div style="margin: 20px auto; padding: 15px; font-size: 24px; font-weight: bold; background: #f4f4f4; width: max-content; letter-spacing: 5px; border-radius: 5px;">
                ${otp}
            </div>
            <p style="color: #999; font-size: 12px;">This code expires in 5 minutes. If you didn't request this, please ignore this email.</p>
        </div>
    `;
    await sendEmail(userEmail, title, htmlContent);
};

module.exports = { sendBookingEmail, sendOTPEmail };
