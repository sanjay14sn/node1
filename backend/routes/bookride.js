const express = require("express");
const router = express.Router();
const {
  requestRide,
  updateBookingStatus,
  getBookingStatus,
  getDriverBookings
} = require("../controllers/bookridecontroller");
const verifyAuth = require("../middlewares/authMiddleware");

// Route for requesting a ride
router.post("/book", verifyAuth, requestRide);

// Route for updating booking status (Driver's action)
router.patch("/booking/:bookingId", verifyAuth, updateBookingStatus);

router.get("/bookings", verifyAuth, getBookingStatus);

router.get("/driver/bookings", verifyAuth, getDriverBookings);


module.exports = router;
