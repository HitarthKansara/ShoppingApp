const { validationResult } = require('express-validator');
const constants = require('../config/constants');

// show validation error message
module.exports = {
    validatorFunc: (req, res, next) => {

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(constants.WEB_STATUS_CODE.BAD_REQUEST).send({ message: errors.array()[0].msg });
        }

        next();
    },
    generateUniqueOrderCode: () => {
        const timestamp = Date.now(); // Current timestamp in milliseconds
        const randomNum = Math.floor(Math.random() * 10000); // Random number between 0 and 9999
        const uniqueIdentifier = 'ORD'; // You can use a specific prefix if needed

        const orderCode = `${uniqueIdentifier}-${timestamp}-${randomNum}`;
        return orderCode;
    }

}