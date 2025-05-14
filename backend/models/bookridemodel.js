const mongoose = require("mongoose");

const bookRideSchema = new mongoose.Schema({
  rideId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Ride",
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  seatsBooked: {
    type: Number,
    required: true,
  },
  bookingStatus: {
    type: String,
    enum: ["pending", "confirmed", "cancelled"],
    default: "pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("BookRide", bookRideSchema);