const constants = require('../../config/constants');
const Product = require('../../models/product.model');

module.exports = {
    addProduct: async (req, res) => {
        try {

            let reqBody = req.body;

            if (!req.files || req.files.length === 0) {
                return res.status(constants.WEB_STATUS_CODE.BAD_REQUEST).json({ message: 'Please upload image file.' });
            } else if (req.isErrorFileType) {
                return res.status(constants.WEB_STATUS_CODE.BAD_REQUEST).json({ message: 'Please upload valid image file.' });
            } else {
                reqBody.image = req.files.map(x => x.filename);
            }


            let isExistingProducts = await Product.findOne({ name: new RegExp(reqBody.name, 'i') });
            if (isExistingProducts) {
                return res.status(constants.WEB_STATUS_CODE.BAD_REQUEST).send({ message: 'This product already exists' });
            }

            let newProduct = new Product(reqBody);
            await newProduct.save();

            res.status(constants.WEB_STATUS_CODE.OK).send({ message: 'Product added successfully' });

        } catch (err) {
            console.log('Error(addProduct): ', err);
            res.status(constants.WEB_STATUS_CODE.SERVER_ERROR).send({ message: 'Server is not responding, Please contact administrator' });
        }
    },

    productList: async (req, res) => {
        try {

            let {
                limit,
                page,
                sortBy,
                search,
            } = req.query;

            page = +page || constants.PAGE;
            limit = (page == 1) ? 10 : constants.LIMIT;

            let query = {};

            let field = 'created_at', value = 1;
            search = search ? search : ''; // for searching
            if (sortBy) {
                const parts = sortBy.split(':');
                field = parts[0];
                parts[1] === 'desc' ? value = -1 : value = 1;
            }

            if (search) {
                query.$or = [
                    { 'name': new RegExp(search, 'i') },
                ]
            }

            const totalProductCount = await Product.count(query);

            if (totalProductCount == 0) {
                return res.status(constants.WEB_STATUS_CODE.OK).send({ message: 'No products found' });
            } else {
                let productsList;
                productsList = await Product.find(query)
                    .sort({ [field]: value })
                    .skip((page - 1) * limit)
                    .limit(limit);

                let dataObj = {
                    data: productsList,
                    total: totalProductCount,
                    limit: limit,
                    page: page,
                };

                return res.status(constants.WEB_STATUS_CODE.OK).send({ message: 'Get product list successfully', data: dataObj });
            }
        } catch (err) {
            console.log('Error(productList): ', err);
            res.status(constants.WEB_STATUS_CODE.SERVER_ERROR).send({ message: 'Server is not responding, Please contact administrator' });
        }
    },

    updateProduct: async (req, res) => {
        try {

            let reqBody = req.body;

            if (!req.files || req.files.length === 0) {
                return res.status(constants.WEB_STATUS_CODE.BAD_REQUEST).json({ message: 'Please upload image file.' });
            } else if (req.isErrorFileType) {
                return res.status(constants.WEB_STATUS_CODE.BAD_REQUEST).json({ message: 'Please upload valid image file.' });
            } else {
                reqBody.image = req.files.map(x => x.filename);
            }


            let isExistingProducts = await Product.findOne({ _id: { $ne: req.params._id }, name: new RegExp(reqBody.name, 'i') });
            if (isExistingProducts) {
                return res.status(constants.WEB_STATUS_CODE.BAD_REQUEST).send({ message: 'This product already exists' });
            }

            await Product.findOneAndUpdate({ _id: req.params._id }, { $set: reqBody });

            res.status(constants.WEB_STATUS_CODE.OK).send({ message: 'Product updated successfully' });

        } catch (err) {
            console.log('Error(updateProduct): ', err);
            res.status(constants.WEB_STATUS_CODE.SERVER_ERROR).send({ message: 'Server is not responding, Please contact administrator' });
        }
    },

    deleteProduct: async (req, res) => {
        try {

            let isExistingProduct = await Product.findOne({ _id: req.params._id });
            if (!isExistingProduct) {
                return res.status(constants.WEB_STATUS_CODE.BAD_REQUEST).send({ message: 'This product doesnot exists' });
            }

            await Product.findOneAndDelete({ _id: req.params._id });

            res.status(constants.WEB_STATUS_CODE.OK).send({ message: 'Product deleted successfully' });

        } catch (err) {
            console.log('Error(deleteProduct): ', err);
            res.status(constants.WEB_STATUS_CODE.SERVER_ERROR).send({ message: 'Server is not responding, Please contact administrator' });
        }
    },

}