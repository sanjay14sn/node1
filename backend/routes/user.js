const express = require('express');
const router = express.Router();

const {
  saveUser,
  getUserByUID,
  updateUserProfile,
  updateFcmToken
} = require('../controllers/usercontroller');

const verifyFirebaseToken = require('../middlewares/authMiddleware');

// Routes
router.post('/user/save', verifyFirebaseToken, saveUser);
router.get('/user/:uid', getUserByUID);
router.post('/user/update', verifyFirebaseToken, updateUserProfile);
router.post('/user/update-fcm', verifyFirebaseToken, updateFcmToken); // ✅ Keep this BEFORE module.exports

module.exports = router;
