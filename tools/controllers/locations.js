const Location = require("../models/location");
const room = require("../models/room");
const Room = require("../models/room");

exports.getLocations = async (req, res, next) => {
  try {
    const locations = await Location.find();

    return res.status(200).json(locations);
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: "",
    });
  }
};

exports.getLocation = async (req, res, next) => {
  try {
    const id = req.params.id;
    const location = await Location.findById(id);
    const rooms = await Room.find({ _id: { $in: location.roomIds } });

    if (!location) {
      return res.status(500).json({
        success: false,
        error: "Location not found",
      });
    }

    return res.status(200).json({
      ...location._doc,
      rooms: rooms,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: "",
    });
  }
};
