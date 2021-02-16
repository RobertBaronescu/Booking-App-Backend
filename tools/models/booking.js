const mongoose = require("mongoose");
const Room = require("../models/room");

const bookingSchema = mongoose.Schema({
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  numberOfDays: { type: Number, required: true },
  price: { type: Number, required: true },
  guests: { type: String, required: true },
  userId: { type: String, required: true },
  roomId: { type: String, required: true },
  hostId: { type: String, required: true },
});

module.exports = mongoose.model("Booking", bookingSchema);
