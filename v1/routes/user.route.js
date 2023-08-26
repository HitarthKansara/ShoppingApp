const express = require('express');
const { signUpValidator, loginValidator, verifyOtpValidator, updateProfileValidator } = require('../../middleware/user.middleware');
const { validatorFunc } = require('../../helpers/commonFunction.helper');
const { signup, logout, verifyOtp, profile, updateProfile, login } = require('../controllers/user.controller');
const { authenticate } = require('../../middleware/authenticate');
const router = express.Router();

router.post('/sign-up', signUpValidator, validatorFunc, signup);
router.post('/login', loginValidator, validatorFunc, login);
router.post('/verify-otp', verifyOtpValidator, validatorFunc, verifyOtp);
router.get('/profile', authenticate, validatorFunc, profile);
router.put('/profile', authenticate, updateProfileValidator, validatorFunc, updateProfile);
router.post('/logout', authenticate, validatorFunc, logout);

module.exports = router;