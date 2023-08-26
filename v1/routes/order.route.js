const express = require('express');
const { adminAccess } = require('../../middleware/authenticate');
const { createOrderValidator, updateOrderValidator, orderDetailsValidator } = require('../../middleware/order.middleware');
const { orderList, createOrder, updateOrder, deleteOrder } = require('../controllers/order.controller');
const { authenticate } = require('../../middleware/authenticate');
const { validatorFunc } = require('../../helpers/commonFunction.helper');
const router = express.Router();

router.post('/add', authenticate, createOrderValidator, validatorFunc, createOrder);
router.get('/list', authenticate, orderList);
router.put('/update/:_id', authenticate, updateOrderValidator, validatorFunc, updateOrder);
router.delete('/delete/:_id', authenticate, adminAccess, orderDetailsValidator, validatorFunc, deleteOrder);

module.exports = router;