const mongoose = require('mongoose');
const dateFormat = require('../helpers/dateFormat.helper');
const jwt = require('jsonwebtoken');
const constants = require('../config/constants');

const userSchema = mongoose.Schema({
    first_name: { type: String },
    last_name: { type: String },
    mobile_number: { type: String },
    email: { type: String },
    otp: { type: Number },
    user_type: { type: Number, default: constants.USER_TYPE.USER },
    is_otp_verified: { type: Boolean, default: false },
    auth_token: { type: String },
    auth_token_expiry: { type: String },
    refresh_token: { type: String },
    created_at: { type: Number },
    updated_at: { type: Number }
});

//Generating auth token
userSchema.methods.generateAuthToken = async function () {

    let user = this;

    let token = jwt.sign({
        _id: user._id.toString(),
        first_name: user?.first_name,
        last_name: user?.last_name,
        email: user?.email,
        mobile_number: user?.mobile_number,
        user_type: user.user_type
    }, process.env.JWT_AUTH_SECRET, {
        expiresIn: '2d'
    });

    const token_expires_at = dateFormat.addTimeToCurrentTimestamp(2, 'days');

    user.auth_token = token;
    user.auth_token_expiry = token_expires_at;
    user.updated_at = dateFormat.setCurrentTimestamp();

    await user.save();
    return token;
};

userSchema.methods.generateRefreshToken = async function () {

    let user = this;

    let refresh_tokens = jwt.sign({
        _id: user._id.toString(),
        user_type: user.user_type
    }, process.env.JWT_REFRESH_SECRET, {
        expiresIn: '7d'
    });

    user.refresh_token = refresh_tokens
    user.updated_at = dateFormat.setCurrentTimestamp();

    await user.save();
    return refresh_tokens;
}


userSchema.pre('save', function (next) {
    if (!this.created_at) this.created_at = dateFormat.setCurrentTimestamp();
    this.updated_at = dateFormat.setCurrentTimestamp();
    next();
});

const User = new mongoose.model('users', userSchema);
module.exports = User;