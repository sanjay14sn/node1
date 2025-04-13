// routes/publish.js
const express = require('express');
const router = express.Router();
const { publishRide } = require('../controllers/publishcontroller');

// Route: POST /api/rides/publish
router.post('/publish', publishRide);

module.exports = router;
