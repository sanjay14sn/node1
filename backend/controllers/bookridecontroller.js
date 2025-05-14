const BookRide = require("../models/bookridemodel");
const Ride = require("../models/publishmodel");
const User = require("../models/user");
const admin = require('firebase-admin');
exports.requestRide = async (req, res) => {
  try {
    const { rideId, seatsBooked } = req.body;
    const userId = req.user.uid;

    const ride = await Ride.findById(rideId);
    if (!ride) return res.status(404).json({ success: false, message: "Ride not found" });

    if (ride.seatsAvailable < seatsBooked) {
      return res.status(400).json({ success: false, message: "Not enough seats available" });
    }

    const newBooking = new BookRide({ rideId, userId, seatsBooked });
    await newBooking.save();

    ride.seatsAvailable -= seatsBooked;
    await ride.save();

    const driver = await User.findOne({ uid: ride.uid });
    if (driver?.fcmToken) {
      const payload = {
        notification: {
          title: "New Ride Booking 🚗",
          body: `A user booked ${seatsBooked} seat(s) on your ride.`,
        },
        token: driver.fcmToken,
      };
      await admin.messaging().send(payload);
    }

    res.status(201).json({
      success: true,
      message: "Ride booked successfully",
      booking: newBooking,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.updateBookingStatus = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { status } = req.body;
    const driverId = req.user.uid;

    const booking = await BookRide.findById(bookingId).populate("rideId");
    if (!booking) return res.status(404).json({ success: false, message: "Booking not found" });

    if (booking.rideId.uid !== driverId) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    booking.bookingStatus = status;
    await booking.save();

    res.status(200).json({
      success: true,
      message: `Booking ${status}`,
      booking,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};