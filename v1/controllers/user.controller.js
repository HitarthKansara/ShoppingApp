const constants = require("../../config/constants");
const User = require('../../models/user.model');
const { generateOTP, sendOtpViaTwilio } = require('../../services/sms.service');

module.exports = {
    signup: async (req, res) => {
        try {

            const reqBody = req.body;

            const mobileNumber = reqBody.mobile_number;

            const isExistingMobileNumber = await User.findOne({ mobile_number: mobileNumber });
            if (isExistingMobileNumber) {
                return res.status(constants.WEB_STATUS_CODE.BAD_REQUEST).send({ message: 'This mobile number already exists' });
            }

            // Generate OTP and send via Twilio SMS
            const otp = generateOTP();
            console.log('otp--->', otp);
            await sendOtpViaTwilio(mobileNumber, otp);

            const newUser = new User(reqBody);

            newUser.otp = otp;

            await newUser.save();

            return res.status(constants.WEB_STATUS_CODE.CREATED).send({ message: 'Otp sent successfully, Please verify' });

        } catch (err) {
            console.log('Error(signup): ', err);
            res.status(constants.WEB_STATUS_CODE.SERVER_ERROR).send({ message: 'Server is not responding, Please contact administrator' });
        }
    },

    login: async (req, res) => {
        try {

            let reqBody = req.body;

            const mobileNumber = reqBody.mobile_number;

            const user = await User.findOne({ mobile_number: mobileNumber });

            if (!user)
                return res.status(constants.WEB_STATUS_CODE.BAD_REQUEST).send({ message: 'User not found' });


            // Generate OTP and send via Twilio SMS
            const otp = generateOTP();
            console.log('otp--->', otp);
            await sendOtpViaTwilio(mobileNumber, otp);

            user.otp = otp;

            await user.save();

            return res.status(constants.WEB_STATUS_CODE.OK).send({ message: 'Otp sent successfully, Please verify' });

        } catch (err) {
            console.log('Error(login): ', err);
            res.status(constants.WEB_STATUS_CODE.SERVER_ERROR).send({ message: 'Server is not responding, Please contact administrator' });
        }
    },

    profile: async (req, res) => {
        try {

            let isMatchedUser = await User.findById({ _id: req.user._id }).lean();

            if (!isMatchedUser)
                return res.status(constants.WEB_STATUS_CODE.BAD_REQUEST).send({ message: 'User not found' });

            delete isMatchedUser?.otp;
            delete isMatchedUser?.auth_token;
            delete isMatchedUser?.auth_token_expiry;
            delete isMatchedUser?.created_at;
            delete isMatchedUser?.updated_at;
            delete isMatchedUser?.__v;
            delete isMatchedUser?.refresh_token;

            return res.status(constants.WEB_STATUS_CODE.OK).send({ message: 'Get user profile successfully', data: isMatchedUser });

        } catch (err) {
            console.log('Error(profile): ', err);
            res.status(constants.WEB_STATUS_CODE.SERVER_ERROR).send({ message: 'Server is not responding, Please contact administrator' });
        }
    },

    updateProfile: async (req, res) => {
        try {

            let reqBody = req.body;

            let updateObj = {
                first_name: reqBody.first_name,
                last_name: reqBody.last_name,
            };

            let isMatchedUser = await User.findOneAndUpdate({ _id: req.user._id }, { $set: updateObj });

            if (!isMatchedUser)
                return res.status(constants.WEB_STATUS_CODE.BAD_REQUEST).send({ message: 'User not found' });

            return res.status(constants.WEB_STATUS_CODE.OK).send({ message: 'User profile updated successfully' });

        } catch (err) {
            console.log('Error(updateProfile): ', err);
            res.status(constants.WEB_STATUS_CODE.SERVER_ERROR).send({ message: 'Server is not responding, Please contact administrator' });
        }
    },

    verifyOtp: async (req, res) => {
        try {

            const reqBody = req.body;

            let isMatchedUser = await User.findOne({ otp: reqBody.otp });

            if (!isMatchedUser)
                return res.status(constants.WEB_STATUS_CODE.BAD_REQUEST).send({ message: 'Incorrect otp' });

            isMatchedUser.is_otp_verified = true;

            await isMatchedUser.generateAuthToken();
            await isMatchedUser.generateRefreshToken();

            await isMatchedUser.save();

            return res.status(constants.WEB_STATUS_CODE.OK).send({ message: 'Otp verified successfully', data: JSON.parse(JSON.stringify(isMatchedUser)) });

        } catch (err) {
            console.log('Error(verifyOtp): ', err);
            res.status(constants.WEB_STATUS_CODE.SERVER_ERROR).send({ message: 'Server is not responding, Please contact administrator' });
        }
    },


    logout: async (req, res) => {
        try {

            await User.findOneAndUpdate({ _id: req.user._id }, { $unset: { auth_token: 1, auth_token_expiry: 1 } });
            return res.status(constants.WEB_STATUS_CODE.CREATED).send({ message: 'User sign up success' });

        } catch (err) {
            console.log('Error(logout): ', err);
            res.status(constants.WEB_STATUS_CODE.SERVER_ERROR).send({ message: 'Server is not responding, Please contact administrator' });
        }
    }
}