const express = require('express');
const Router = express.Router(); // ✅ fixed

const { getProducts, getsingleProduct } = require('../controllers/productcontroller'); // ✅ fixed

Router.route('/products').get(getProducts);
Router.route('/product/:id').get(getsingleProduct);

module.exports = Router; // ✅ fixed
