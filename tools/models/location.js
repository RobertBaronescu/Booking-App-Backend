const mongoose = require("mongoose");

const locationSchema = mongoose.Schema({
  name: { type: String, required: true },
  nickName: { type: String, required: true },
  image: { type: String, required: true },
  description: { type: String, required: true },
  roomIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Room" }],
});

module.exports = mongoose.model("Location", locationSchema);
