const mongoose = require("mongoose");

const bookingSchema = mongoose.Schema({
  checkInDate: { type: Date, required: true },
  checkOutDate: { type: Date, required: true },
  nights: { type: Number, required: true },
  price: { type: Number, required: true },
  guests: { type: Number, required: true },
});

module.exports = mongoose.model("Booking", bookingSchema);
