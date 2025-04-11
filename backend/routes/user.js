const express = require('express');
const router = express.Router();

const { saveUser, getUserByUID , updateUserProfile} = require('../controllers/usercontroller');
const verifyFirebaseToken = require('../middlewares/authMiddleware');

// POST /api/v1/user/save
router.post('/user/save', verifyFirebaseToken, saveUser);

// GET /api/v1/user/:uid
router.get('/user/:uid', getUserByUID);

// POST /api/v1/user/update
router.post('/user/update', verifyFirebaseToken, updateUserProfile);

module.exports = router;
