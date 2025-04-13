// controllers/publishcontroller.js
const Ride = require('../models/publishmodel');

// Publish a new ride
exports.publishRide = async (req, res) => {
  try {
    const {
      uid,
      from,
      to,
      date,
      time,
      seatsAvailable,
      pricePerSeat,
      vehicleDetails
    } = req.body;

    const newRide = new Ride({
      uid,
      from,
      to,
      date,
      time,
      seatsAvailable,
      pricePerSeat,
      vehicleDetails
    });

    const savedRide = await newRide.save();
    console.log('✅ Ride published successfully');

    res.status(201).json({
      success: true,
      ride: savedRide
    });
  } catch (err) {
    console.error('❌ Failed to publish ride:', err.message);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};
