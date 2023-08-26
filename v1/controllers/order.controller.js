const Order = require('../../models/order.model');
const Product = require('../../models/product.model');
const User = require('../../models/user.model');
const dateFormat = require('../../helpers/dateFormat.helper');
const constants = require('../../config/constants');
const { generateUniqueOrderCode } = require('../../helpers/commonFunction.helper');

module.exports = {
    createOrder: async (req, res) => {
        try {

            let reqBody = req.body;

            let productIds = reqBody.products.map(x => x.id);

            let isProductExists = await Product.find({ _id: { $in: productIds } });

            if (isProductExists.length != productIds.length) {
                return res.status(constants.WEB_STATUS_CODE.BAD_REQUEST).send({ message: 'Some products were not found' });
            }

            let isExistingOrder = await Order.findOne({ order_code: reqBody.order_code });
            if (isExistingOrder) {
                return res.status(constants.WEB_STATUS_CODE.BAD_REQUEST).send({ message: 'This order alredy exists' });
            }

            const uniqueOrderCode = generateUniqueOrderCode();

            reqBody.charges = reqBody.products.reduce((accumulator, currentValue) => {
                return accumulator.quantity * accumulator.price || 0 + currentValue.quantity * currentValue.price || 0;
            }, 0);

            reqBody.order_code = uniqueOrderCode;
            reqBody.user_id = req.user._id;

            const newOrder = new Order(reqBody);

            await newOrder.save();

            res.status(constants.WEB_STATUS_CODE.OK).send({ message: 'Order created successfully' });

        } catch (err) {
            console.log('Error(createOrder): ', err);
            res.status(constants.WEB_STATUS_CODE.SERVER_ERROR).send({ message: 'Server is not responding, Please contact administrator' });
        }
    },


    orderList: async (req, res) => {
        try {

            let {
                limit,
                page,
                sortBy,
                user_id
            } = req.query;

            page = +page || constants.PAGE;
            limit = (page == 1) ? 10 : constants.LIMIT;

            let query = {};

            let field = 'created_at', value = 1;

            if (sortBy) {
                const parts = sortBy.split(':');
                field = parts[0];
                parts[1] === 'desc' ? value = -1 : value = 1;
            }

            if (user_id) {
                query.user_id = user_id;
            }

            const totalOrderCount = await Order.count(query);

            if (totalOrderCount == 0) {
                return res.status(constants.WEB_STATUS_CODE.OK).send({ message: 'No orders found' });
            } else {
                let ordersList;
                ordersList = await Order.find(query).populate([
                    {
                        path: 'user_id',
                        select: 'first_name last_name'
                    }, {
                        path: 'products.id',
                        select: 'name'
                    }
                ]).sort({ [field]: value }).skip((page - 1) * limit).limit(limit);

                let dataObj = {
                    data: ordersList,
                    total: totalOrderCount,
                    limit: limit,
                    page: page,
                };

                return res.status(constants.WEB_STATUS_CODE.OK).send({ message: 'Get order list successfully', data: dataObj });
            }
        } catch (err) {
            console.log('Error(orderList): ', err);
            res.status(constants.WEB_STATUS_CODE.SERVER_ERROR).send({ message: 'Server is not responding, Please contact administrator' });
        }
    },

    updateOrder: async (req, res) => {
        try {

            let reqBody = req.body;

            let isProductExists = await Order.findOne({ _id: req.params._id });
            if (!isProductExists) {
                return res.status(constants.WEB_STATUS_CODE.BAD_REQUEST).send({ message: 'This product doesnot exists' });
            }

            if (reqBody?.products) {
                reqBody.charges = reqBody?.products.reduce((accumulator, currentValue) => {
                    return accumulator?.quantity * accumulator?.price || 0 + currentValue?.quantity * currentValue?.price || 0;
                }, 0)
            }

            await Order.findOneAndUpdate({ _id: req.params._id }, { $set: reqBody });

            res.status(constants.WEB_STATUS_CODE.OK).send({ message: 'Order updated successfully' });

        } catch (err) {
            console.log('Error(updateOrder): ', err);
            res.status(constants.WEB_STATUS_CODE.SERVER_ERROR).send({ message: 'Server is not responding, Please contact administrator' });
        }
    },

    deleteOrder: async (req, res) => {
        try {

            let isExistingProduct = await Order.findOne({ _id: req.params._id });
            if (!isExistingProduct) {
                return res.status(constants.WEB_STATUS_CODE.BAD_REQUEST).send({ message: 'This order doesnot exists' });
            }

            await Order.findOneAndDelete({ _id: req.params._id });

            res.status(constants.WEB_STATUS_CODE.OK).send({ message: 'Order deleted successfully' });

        } catch (err) {
            console.log('Error(deleteOrder): ', err);
            res.status(constants.WEB_STATUS_CODE.SERVER_ERROR).send({ message: 'Server is not responding, Please contact administrator' });
        }
    },
}