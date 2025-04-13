// models/publishmodel.js
const mongoose = require('mongoose');

const rideSchema = new mongoose.Schema({
  uid: { type: String, required: true },
  from: {
    city: String,
    location: String,
    lat: Number,
    lng: Number
  },
  to: {
    city: String,
    location: String,
    lat: Number,
    lng: Number
  },
  date: { type: Date, required: true }, // full date (with or without time)
  time: { type: String, required: true }, // example: "10:30 AM"
  seatsAvailable: { type: Number, required: true },
  pricePerSeat: Number,
  vehicleDetails: {
    type: { type: String },
    plateNumber: String
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Ride', rideSchema);
