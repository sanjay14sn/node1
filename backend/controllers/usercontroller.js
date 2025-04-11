const User = require('../models/user');

// Save user if new
exports.saveUser = async (req, res) => {
  try {
    const { uid, email } = req.user;
    const { name, photoURL } = req.body;

    let user = await User.findOne({ uid });

    if (!user) {
      user = new User({
        uid,
        email,
        name,
        photoURL,
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
};

// Get user by UID
exports.getUserByUID = async (req, res) => {
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
};
