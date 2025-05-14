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
      bookingStatus: "pending" // ✅ fixed to lowercase
    });

    await newBooking.save();
    console.log('✅ New booking saved:', newBooking._id);

    ride.seatsAvailable -= seatsBooked;
    await ride.save();
    console.log(`🪑 Updated ride seat count. Remaining: ${ride.seatsAvailable}`);

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
      message: "Ride booked successfully",
      booking: newBooking,
    });

  } catch (err) {
    console.error('❌ Server error while booking ride:', err.message);
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

    booking.bookingStatus = bookingStatus;
    await booking.save();

    // Optional: send notification to passenger
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

