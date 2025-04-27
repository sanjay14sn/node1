const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');  // Import UUID package

const rideSchema = new mongoose.Schema({
  rideId: { type: String, default: uuidv4 }, // ⬅️ Use UUID as rideId
  uid: { type: String, required: true },
  from: {
    city: String,
    location: String,
    lat: Number,
    lng: Number,
    coordinates: {
      type: [Number], // [lng, lat]
      index: '2dsphere'
    }
  },
  to: {
    city: String,
    location: String,
    lat: Number,
    lng: Number,
    coordinates: {
      type: [Number], // [lng, lat]
      index: '2dsphere'
    }
  },
  date: { type: Date, required: true },
  startTime: { type: String },
  endTime: { type: String },
  seatsAvailable: { type: Number, required: true },
  pricePerSeat: Number,
  vehicleDetails: {
    type: { type: String },
    plateNumber: String
  },
  createdAt: { type: Date, default: Date.now }
});

// Automatically set coordinates
rideSchema.pre('save', function (next) {
  if (this.to?.lat != null && this.to?.lng != null) {
    this.to.coordinates = [this.to.lng, this.to.lat];
  }
  if (this.from?.lat != null && this.from?.lng != null) {
    this.from.coordinates = [this.from.lng, this.from.lat];
  }
  next();
});

module.exports = mongoose.model('Ride', rideSchema);
