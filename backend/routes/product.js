const express = require('express');
const Router = express.Router(); // ✅ fixed

const { getProducts, getsingleProduct, createProduct,deleteProduct } = require('../controllers/productcontroller');

Router.route('/products').get(getProducts).post(createProduct); 

Router.route('/products').get(getProducts);
Router.route('/product/:id').get(getsingleProduct);
Router.route('/product/:id').delete(deleteProduct);

module.exports = Router; // ✅ fixed
