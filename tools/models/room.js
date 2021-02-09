const mongoose = require("mongoose");

const roomSchema = mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  type: { type: String, required: true },
  smallDescription: { type: String, required: true },
  theSpace: { type: String, required: true },
  interactionWithGuests: { type: String, required: true },
  ameneties: { type: String, required: false },
  price: { type: String, required: true },
  bookingIds: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
    },
  ],
  pictures: [{ type: String, required: false }],

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
    
    },
  ],
});

module.exports = mongoose.model("Room", roomSchema);
