const express = require('express');
const router = express.Router();
const { publishRide, searchRides, getMyRides } = require('../controllers/publishcontroller');
const verifyFirebaseToken = require('../middlewares/authMiddleware');  // Add this import

// Route: POST /api/rides/publish
router.post('/publish', publishRide);

// GET route to search rides
router.get('/search', searchRides);

// GET route to fetch rides posted by a specific user, applying the token verification middleware
router.get('/myrides', verifyFirebaseToken, getMyRides);  // Apply middleware here

module.exports = router;
