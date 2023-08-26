const express = require('express');
const fileUpload = require('../../middleware/fileupload');
const { authenticate, adminAccess } = require('../../middleware/authenticate');
const { validatorFunc } = require('../../helpers/commonFunction.helper');
const { addProduct, productList, updateProduct, deleteProduct } = require('../controllers/product.controller');
const { addProductValidator, updateProductValidator, productDetailsValidator } = require('../../middleware/product.middleware');
const router = express.Router();


router.post('/add', authenticate, adminAccess, fileUpload, addProductValidator, validatorFunc, addProduct);
router.get('/list', authenticate, productList);
router.put('/update/:_id', authenticate, adminAccess, fileUpload, updateProductValidator, validatorFunc, updateProduct);
router.delete('/delete/:_id', authenticate, adminAccess, productDetailsValidator, validatorFunc, deleteProduct);

module.exports = router;