const express = require('express');
const { createorder } = require('../controllers/ordercontroller');

const Router = express.Router();

Router.route('/order').post(createorder);

module.exports = Router;