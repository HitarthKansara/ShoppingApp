const { body } = require('express-validator');


module.exports = {
    signUpValidator: [
        body('mobile_number')
            .not()
            .isEmpty()
            .withMessage('Mobile number is required')
            .trim(),
        body('first_name')
            .not()
            .isEmpty()
            .withMessage('First Name is required')
            .trim(),
        body('last_name')
            .not()
            .isEmpty()
            .withMessage('Last Name is required')
            .trim(),
    ],

    loginValidator: [
        body('mobile_number')
            .not()
            .isEmpty()
            .withMessage('Mobile number is required')
            .trim(),
    ],

    verifyOtpValidator: [
        body('otp')
            .not()
            .isEmpty()
            .withMessage('Otp is required')
            .trim(),
    ],

    updateProfileValidator: [
        body('mobile_number')
            .optional()
            .not()
            .isEmpty()
            .withMessage('Mobile number is required')
            .trim(),
        body('first_name')
            .not()
            .isEmpty()
            .withMessage('First Name is required')
            .trim(),
        body('last_name')
            .not()
            .isEmpty()
            .withMessage('Last Name is required')
            .trim(),
    ],

}