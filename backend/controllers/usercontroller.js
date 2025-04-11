const express = require('express');
const router = express.Router();
const User = require('../models/User');
const verifyFirebaseToken = require('../middlewares/authMiddleware');

// 🆕 Save user if new
router.post('/user/save', verifyFirebaseToken, async (req, res) => {
  try {
    const { uid, email, name, picture } = req.user;

    let user = await User.findOne({ uid });

    if (!user) {
      user = new User({
        uid,
        email,
        name,
        photoURL: picture,
      });
      await user.save();
      console.log('✅ New user saved in DB');
    } else {
      console.log('ℹ️ User already exists');
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (err) {
    console.error('❌ Failed to save user:', err.message);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
});

// Existing: Get user by UID
router.get('/user/:uid', async (req, res) => {
  try {
    const user = await User.findOne({ uid: req.params.uid });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (err) {
    console.error('❌ Failed to fetch user:', err.message);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
});

module.exports = router;
