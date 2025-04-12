const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  uid: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
  },
  name: String,
  photoURL: String,
  phone: String,

  
  dob: Date,
  userRating: String,
  aboutUser:String,
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
