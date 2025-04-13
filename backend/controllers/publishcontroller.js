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
// Search rides within 50 km of provided lat/lng

// Search rides within 50 km of provided lat/lng
exports.searchRides = async (req, res) => {
  try {
    const { fromLat, fromLng, toLat, toLng } = req.query;

    // Validate coordinates
    if (!fromLat || !fromLng || !toLat || !toLng) {
      return res.status(400).json({
        success: false,
        message: 'fromLat, fromLng, toLat, and toLng are all required.'
      });
    }

    const fromLatitude = parseFloat(fromLat);
    const fromLongitude = parseFloat(fromLng);
    const toLatitude = parseFloat(toLat);
    const toLongitude = parseFloat(toLng);

    console.log('🔍 Searching rides within 50km of both FROM and TO:', {
      fromLatitude,
      fromLongitude,
      toLatitude,
      toLongitude
    });

    // Query for rides matching both FROM and TO within 50km
    const rides = await Ride.find({
      'from.coordinates': {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [fromLongitude, fromLatitude]
          },
          $maxDistance: 50000
        }
      },
      'to.coordinates': {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [toLongitude, toLatitude]
          },
          $maxDistance: 50000
        }
      }
    });

    res.json({
      success: true,
      results: rides.length,
      rides
    });
  } catch (err) {
    console.error('❌ Ride search failed:', err.message);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};
