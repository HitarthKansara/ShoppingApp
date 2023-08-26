const User = require('../models/user.model');
const jwt = require('jsonwebtoken');
const constants = require('../config/constants');
const JWT_SECRET = process.env.JWT_AUTH_SECRET;

module.exports = {

    // authenticate user
    authenticate: async (req, res, next) => {
        try {

            if (!req.header('Authorization')) return res.status(constants.WEB_STATUS_CODE.UNAUTHORIZED).send({ message: 'Unauthorized, please login' });

            const token = req.header('Authorization')?.toString().replace('Bearer ', '');
            if (!token) res.status(constants.WEB_STATUS_CODE.BAD_REQUEST).send({ message: 'Token not found' });

            const decoded = jwt.verify(token, JWT_SECRET);
            const user = await User.findOne({ _id: decoded._id, auth_token: token }).lean();

            if (!user) return res.status(constants.WEB_STATUS_CODE.UNAUTHORIZED).send({ message: 'Unauthorized, please login' });

            if (!user?.is_otp_verified) return res.status(constants.WEB_STATUS_CODE.UNAUTHORIZED).send({ message: 'Otp is not verified, Please verify otp' });

            req.token = token;
            req.user = user;

            next();
        } catch (err) {
            console.log('Error(authenticate): ', err);

            if (err.message == 'jwt expired' || err.message == 'jwt malformed')
                return res.status(constants.WEB_STATUS_CODE.UNAUTHORIZED).send({ message: 'Jwt is expired' });

            return res.status(constants.WEB_STATUS_CODE.SERVER_ERROR).send({ message: 'Server is not responding, Please contact administrator' });
        }
    },

    adminAccess: async (req, res, next) => {
        try {

            if (req.user.user_type == constants.USER_TYPE.ADMIN)
                next();
            else
                return res.status(constants.WEB_STATUS_CODE.UNAUTHORIZED).send({ message: 'Admin access only' });

        } catch (err) {
            console.log('Error(adminAccess): ', err);
            return res.status(constants.WEB_STATUS_CODE.SERVER_ERROR).send({ message: 'Server is not responding, Please contact administrator' });
        }

    }
}