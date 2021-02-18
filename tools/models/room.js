const mongoose = require("mongoose");

const roomSchema = mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  intro: { type: String, required: true },
  description: { type: String, required: true },
  thumbnail: { type: String, required: true },
  interactionWithGuests: { type: String, required: true },
  amenities: [
    {
      name: { type: String, required: false },
      icon: { type: String, required: false },
    },
  ],
  price: { type: Number, required: true },
  bookingIds: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: false,
    },
  ],

  reviews: [
    {
      content: {
        type: String,
      },
      createdDate: {
        type: Date,
        default: Date.now(),
      },
      rating: { type: Number, required: true },
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      required: false,
    },
  ],
  rating: { type: Number, required: true },
  hostId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  photos: [{ type: String, required: false }],
});

module.exports = mongoose.model("Room", roomSchema);
