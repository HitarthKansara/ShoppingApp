const mongoose = require('mongoose');
const dateFormat = require('../helpers/dateFormat.helper');

const productSchema = mongoose.Schema({
    name: { type: String },
    size: { type: String },
    image: [{ type: String }],
    colour: { type: String },
    price: { type: Number },
    quantity: { type:Number },
    created_at: { type: Number },
    updated_at: { type: Number }
});

productSchema.pre('save', function (next) {
    if (!this.created_at) this.created_at = dateFormat.setCurrentTimestamp();
    this.updated_at = dateFormat.setCurrentTimestamp();
    next();
});


const Product = new mongoose.model('product', productSchema);
module.exports = Product;