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

// Update user profile fields
exports.updateUserProfile = async (req, res) => {
    try {
      const { uid } = req.user; // from Firebase auth middleware
      const { phone, dob, userRating, name, aboutUser } = req.body;
  
      const updatedUser = await User.findOneAndUpdate(
        { uid },
        {
          phone,
          dob,
          userRating,
          name,
          aboutUser,
        },
        { new: true, upsert: true }
      );
  
      res.status(200).json({
        success: true,
        message: 'User updated successfully',
        user: updatedUser,
      });
    } catch (err) {
      console.error('❌ Failed to update user:', err.message);
      res.status(500).json({
        success: false,
        message: 'Server error',
      });
    }
  };
  