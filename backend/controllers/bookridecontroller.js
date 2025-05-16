const BookRide = require("../models/bookridemodel");
const Ride = require("../models/publishmodel");
const User = require("../models/user");
const admin = require('firebase-admin');

exports.requestRide = async (req, res) => {
  try {
    const { rideId, seatsBooked } = req.body;
    const userId = req.user.uid;

    console.log('📥 Incoming ride request:', { rideId, seatsBooked, userId });

    const ride = await Ride.findById(rideId);
    if (!ride) {
      console.warn('❌ Ride not found with ID:', rideId);
      return res.status(404).json({ success: false, message: "Ride not found" });
    }

    console.log('🚘 Ride found:', {
      rideId: ride._id,
      driverId: ride.uid,
      seatsAvailable: ride.seatsAvailable
    });

    if (ride.seatsAvailable < seatsBooked) {
      console.warn(`⚠️ Not enough seats. Requested: ${seatsBooked}, Available: ${ride.seatsAvailable}`);
      return res.status(400).json({ success: false, message: "Not enough seats available" });
    }

    const newBooking = new BookRide({
      rideId,
      userId,
      seatsBooked,
      bookingStatus: "pending" // still pending until driver accepts
    });

    await newBooking.save();
    console.log('✅ New booking saved:', newBooking._id);

    // ❌ Remove this line:
    // ride.seatsAvailable -= seatsBooked;

    const driver = await User.findOne({ uid: ride.uid });

    if (driver) {
      console.log('👤 Driver found:', {
        uid: driver.uid,
        fcmToken: driver.fcmToken || 'No FCM token'
      });

      if (driver.fcmToken) {
        const payload = {
          notification: {
            title: "New Ride Booking 🚗",
            body: `A user booked ${seatsBooked} seat(s) on your ride. Please approve or reject.`,
          },
          token: driver.fcmToken,
        };

        console.log('📡 Sending FCM notification:', payload.notification);
        await admin.messaging().send(payload);
        console.log('✅ FCM notification sent successfully');
      } else {
        console.warn('⚠️ Driver has no FCM token. Notification not sent.');
      }
    } else {
      console.warn('⚠️ No driver found with UID:', ride.uid);
    }

    res.status(201).json({
      success: true,
      message: "Ride request sent successfully",
      booking: newBooking,
    });

  } catch (err) {
    console.error('❌ Server error while requesting ride:', err.message);
    console.error('🧾 Full error:', err);

    res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
};



exports.updateBookingStatus = async (req, res) => {
  try {
    const { bookingStatus } = req.body;
    const { bookingId } = req.params;
    const driverId = req.user.uid;

    const booking = await BookRide.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }

    const ride = await Ride.findById(booking.rideId);
    if (!ride || ride.uid !== driverId) {
      return res.status(403).json({ success: false, message: "Not authorized to update this booking" });
    }

    if (!["confirmed", "cancelled"].includes(bookingStatus)) {
      return res.status(400).json({ success: false, message: "Invalid booking status" });
    }

    // If confirming, check seat availability
    if (bookingStatus === "confirmed") {
      if (ride.seatsAvailable < booking.seatsBooked) {
        return res.status(400).json({ success: false, message: "Not enough seats available" });
      }
      ride.seatsAvailable -= booking.seatsBooked;
      await ride.save();
    }

    // If cancelling, release the seats (if previously confirmed)
    if (booking.bookingStatus === "confirmed" && bookingStatus === "cancelled") {
      ride.seatsAvailable += booking.seatsBooked;
      await ride.save();
    }

    booking.bookingStatus = bookingStatus;
    await booking.save();

    const passenger = await User.findOne({ uid: booking.userId });
    if (passenger?.fcmToken) {
      const payload = {
        notification: {
          title: `Your ride has been ${bookingStatus}`,
          body: bookingStatus === "confirmed"
            ? "Your booking is confirmed 🎉"
            : "Sorry, your booking was cancelled",
        },
        token: passenger.fcmToken,
      };
      await admin.messaging().send(payload);
    }

    return res.status(200).json({ success: true, message: "Booking status updated", booking });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};




exports.cancelRideByUser = async (req, res) => {
  try {
    const userId = req.user.uid;
    const { bookingId } = req.params;

    const booking = await BookRide.findById(bookingId);
    if (!booking || booking.userId !== userId) {
      return res.status(404).json({ success: false, message: "Booking not found or unauthorized" });
    }

    if (booking.bookingStatus === "cancelled") {
      return res.status(400).json({ success: false, message: "Booking already cancelled" });
    }

    const ride = await Ride.findById(booking.rideId);
    if (!ride) {
      return res.status(404).json({ success: false, message: "Ride not found" });
    }

    if (booking.bookingStatus === "confirmed") {
      ride.seatsAvailable += booking.seatsBooked;
      await ride.save();
    }

    booking.bookingStatus = "cancelled";
    await booking.save();

    res.status(200).json({ success: true, message: "Booking cancelled successfully", booking });
  } catch (err) {
    console.error("❌ Error cancelling booking by user:", err.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


exports.getBookingStatus = async (req, res) => {
  try {
    const userId = req.user.uid;
    const { rideId } = req.query;

    if (!rideId) {
      return res.status(400).json({ success: false, message: "rideId is required" });
    }

    const booking = await BookRide.findOne({ rideId, userId });

    if (!booking) {
      return res.status(200).json({ success: true, booking: null });
    }

    return res.status(200).json({ success: true, booking });
  } catch (err) {
    console.error("❌ Error fetching booking:", err.message);
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
};

// Add to bookridecontroller.js
exports.getDriverBookings = async (req, res) => {
  try {
    const driverId = req.user.uid;

    const rides = await Ride.find({ uid: driverId });
    const rideIds = rides.map(r => r._id);

    const bookings = await BookRide.find({ rideId: { $in: rideIds } })
      .populate('rideId');

    res.status(200).json({ success: true, bookings });
  } catch (err) {
    console.error('❌ Error fetching driver bookings:', err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
exports.getConfirmedBookings = async (req, res) => {
  try {
    const userId = req.user.uid;

    const confirmedBookings = await BookRide.find({
      userId,
      bookingStatus: 'confirmed'
    }).populate('rideId');

    // Filter out bookings with missing ride data
    const filteredBookings = confirmedBookings.filter(booking => booking.rideId !== null);

    res.status(200).json({
      success: true,
      bookings: filteredBookings,
    });
  } catch (err) {
    console.error('❌ Error fetching confirmed bookings:', err);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

