// routes/publish.js
const express = require('express');
const router = express.Router();
const { publishRide } = require('../controllers/publishcontroller');
const publishController = require('../controllers/publishcontroller');

// Route: POST /api/rides/publish
router.post('/publish', publishRide);
// GET route to search rides
router.get('/search', publishController.searchRides);

module.exports = router;
