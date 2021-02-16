const Location = require("../models/location");
const Room = require("../models/room");
const User = require("../models/user");

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
    for (let i = 0; i < rooms.length; i++) {
      const host = await User.findOne({ _id: rooms[i].hostId });
      rooms[i]._doc = {
        ...rooms[i]._doc,
        hostName: host.name,
        hostPicture: host.picture,
      };
    }

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

exports.getLocationByRoomId = async (req, res, next) => {
  try {
    const location = await Location.findOne({ roomIds: req.params.roomId });
    console.log(location._id);
    return res.status(200).send(location._id);
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: "",
    });
  }
};
