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
  userRating: {
    type: Number,
    default: 0,
  },
  aboutUser: {
    type: [String], // or { section1: String, section2: String } if you want object format
  },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
