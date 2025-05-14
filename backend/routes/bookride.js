const express = require("express");
const router = express.Router();
const {
  requestRide,
  updateBookingStatus,
} = require("../controllers/bookridecontroller");
const verifyAuth = require("../middlewares/authMiddleware");

router.post("/book", verifyAuth, requestRide);
router.patch("/booking/:bookingId", verifyAuth, updateBookingStatus);

module.exports = router;