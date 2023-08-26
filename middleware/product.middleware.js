const { body, param } = require('express-validator');

module.exports = {
    addProductValidator: [
        body('name')
            .not()
            .isEmpty()
            .withMessage('Name is required')
            .trim(),
        body('size')
            .not()
            .isEmpty()
            .withMessage('Size is required')
            .trim(),
        body('colour')
            .not()
            .isEmpty()
            .withMessage('Colour is required')
            .trim(),
        body('price')
            .not()
            .isEmpty()
            .withMessage('Price is required')
            .trim(),
        body('quantity')
            .not()
            .isEmpty()
            .withMessage('Quantity is required')
            .trim(),
    ],

    updateProductValidator: [
        param('_id')
            .not()
            .isEmpty()
            .withMessage('Id is required')
            .isMongoId()
            .withMessage('Please enter valid Id')
            .trim(),
        body('name')
            .not()
            .isEmpty()
            .withMessage('Name is required')
            .trim(),
        body('size')
            .not()
            .isEmpty()
            .withMessage('Size is required')
            .trim(),
        body('colour')
            .not()
            .isEmpty()
            .withMessage('Colour is required')
            .trim(),
        body('price')
            .not()
            .isEmpty()
            .withMessage('Price is required')
            .trim(),
        body('quantity')
            .not()
            .isEmpty()
            .withMessage('Quantity is required')
            .trim(),
    ],

    productDetailsValidator: [
        param('_id')
            .not()
            .isEmpty()
            .withMessage('Id is required')
            .isMongoId()
            .withMessage('Please enter valid Id')
            .trim()
    ]
}