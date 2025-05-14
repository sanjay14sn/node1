// controllers/publishcontroller.js
const Ride = require("../models/publishmodel");
const axios = require('axios');


// Publish a new ride
// Publish a new ride
exports.publishRide = async (req, res) => {
  try {
    const {
      uid,
      from,
      to,
      date,
      time,
      startTime,
      endTime,
      seatsAvailable,
      pricePerSeat,
      vehicleDetails,
    } = req.body;

    const newRide = new Ride({
      uid,
      from,
      to,
      date,
      startTime,
      endTime,
      seatsAvailable,
      pricePerSeat,
      vehicleDetails,
    });

    const savedRide = await newRide.save();
    console.log("✅ Ride published successfully");

    res.status(201).json({
      success: true,
      ride: {
        id: savedRide.rideId, // Now UUID as rideId
        ...savedRide.toObject(),
      },
    });
  } catch (err) {
    console.error("❌ Failed to publish ride:", err.message);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message, // helpful in dev
    });
  }
};

// Search rides within 50 km of provided lat/lng

// Search rides within 50 km of provided lat/lng
exports.searchRides = async (req, res) => {
  try {
    const { fromLat, fromLng, toLat, toLng } = req.query;

    if (!fromLat || !fromLng || !toLat || !toLng) {
      return res.status(400).json({
        success: false,
        message: "fromLat, fromLng, toLat, and toLng are required.",
      });
    }

    const fromLatitude = parseFloat(fromLat);
    const fromLongitude = parseFloat(fromLng);
    const toLatitude = parseFloat(toLat);
    const toLongitude = parseFloat(toLng);

    console.log("🔍 Searching rides within 50km of both FROM and TO:", {
      fromLatitude,
      fromLongitude,
      toLatitude,
      toLongitude,
    });

    // Earth radius in km
    const radiusInKm = 50;
    const degreeOffset = radiusInKm / 111; // ~111 km per degree

    const rides = await Ride.find({
      "from.coordinates": {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [fromLongitude, fromLatitude],
          },
          $maxDistance: 50000,
        },
      },
      "to.lat": {
        $gte: toLatitude - degreeOffset,
        $lte: toLatitude + degreeOffset,
      },
      "to.lng": {
        $gte: toLongitude - degreeOffset,
        $lte: toLongitude + degreeOffset,
      },
    });

    // Enrich each ride with user data by calling your user API
    const enrichedRides = await Promise.all(
      rides.map(async (ride) => {
        let user = {};
        try {
          const userRes = await axios.get(
            `https://cloths-api-backend.onrender.com/api/v1/user/${ride.uid}`
          ); // 👈 Change port if needed
          user = userRes.data.user;
        } catch (err) {
          console.warn(
            `⚠️ Could not fetch user data for uid ${ride.uid}:`,
            err.message
          );
        }

        return {
          ...ride.toObject(),
          user, // attach user data
        };
      })
    );

    res.status(200).json({
      success: true,
      results: enrichedRides.length,
      rides: enrichedRides,
    });
  } catch (err) {
    console.error("❌ Ride search failed:", err.message);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// controllers/usercontroller.js

exports.updateFcmToken = async (req, res) => {
  try {
    const { uid } = req.user; // Assuming Firebase auth
    const { fcmToken } = req.body;

    if (!fcmToken) {
      return res.status(400).json({ success: false, message: 'FCM token is required' });
    }

    const user = await User.findOneAndUpdate(
      { uid },
      { fcmToken },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({
      success: true,
      message: 'FCM token updated successfully',
      user,
    });
  } catch (err) {
    console.error('❌ Failed to update FCM token:', err.message);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};


// Get all rides published by a specific user
exports.getMyRides = async (req, res) => {
  try {
    const { uid } = req.query;

    if (!uid) {
      return res.status(400).json({
        success: false,
        message: "User ID (uid) is required.",
      });
    }

    const userRides = await Ride.find({ uid });

    res.status(200).json({
      success: true,
      results: userRides.length,
      rides: userRides,
    });
  } catch (err) {
    console.error("❌ Failed to fetch user rides:", err.message);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
