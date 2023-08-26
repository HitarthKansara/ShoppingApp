const twilio = require('twilio');

// Twilio setup
const accountSid = process.env.ACCOUNTSID;
const authToken = process.env.AUTHTOKEN;
const twilioPhoneNumber = '+18507805906';

const client = twilio(accountSid, authToken);

// Function to send OTP via Twilio SMS
const sendOtpViaTwilio = async (to, otp) => {
    try {
        let messageId = await client.messages.create({
            body: `Your OTP is: ${otp}`,
            from: twilioPhoneNumber,
            to,
        });
        console.log('messageId--->', messageId);

    } catch (error) {
        console.error('Error(sendOtpViaTwilio): ', error);
        throw error;
    }
};

// Generate a random OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

module.exports = { generateOTP, sendOtpViaTwilio };