// routes/price.js

const express = require('express');
const router = express.Router();
const { calculatePrice } = require('../controllers/calculateprice');

// Define the route for price calculation
router.post('/calculate-price', calculatePrice);

module.exports = router;
