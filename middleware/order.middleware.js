const { body, param } = require('express-validator');

module.exports = {
    createOrderValidator: [
        body('required_date')
            .not()
            .isEmpty()
            .withMessage('Required date is required')
            .trim(),
        body('products')
            .not()
            .isEmpty()
            .withMessage('Products is required'),
    ],

    updateOrderValidator: [
        param('_id')
            .not()
            .isEmpty()
            .withMessage('Id is required')
            .isMongoId()
            .withMessage('Please enter valid Id')
            .trim(),
    ],

    orderDetailsValidator: [
        param('_id')
            .not()
            .isEmpty()
            .withMessage('Id is required')
            .isMongoId()
            .withMessage('Please enter valid Id')
            .trim()
    ]
}