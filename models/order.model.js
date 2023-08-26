const mongoose = require('mongoose');
const constants = require('../config/constants');
const dateFormat = require('../helpers/dateFormat.helper');

const orderSchema = mongoose.Schema({
    user_id: { type: mongoose.Types.ObjectId, ref: 'users' },
    order_code: { type: String },
    order_date: { type: Number, default: dateFormat.setCurrentTimestamp() },
    required_date: { type: Number },
    shipped_date: { type: Number },
    order_status: { type: Number, default: constants.ORDER_STATUS.CREATED },
    products: [
        {
            id: { type: mongoose.Types.ObjectId, ref: 'product' },
            quantity: { type: Number },
            price: { type: Number }
        }
    ],
    charges: { type: Number },
    created_at: { type: Number },
    updated_at: { type: Number },
});

orderSchema.pre('save', function (next) {
    if (!this.created_at) this.created_at = dateFormat.setCurrentTimestamp();
    this.updated_at = dateFormat.setCurrentTimestamp();
    next();
});

const Order = new mongoose.model('order', orderSchema);
module.exports = Order;