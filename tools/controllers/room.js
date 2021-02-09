const Room = require("../models/room");
const User = require("../models/user");

exports.getRooms = async (req, res, next) => {
  try {
    const rooms = await Room.find();

    return res.status(200).json(rooms);
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: "",
    });
  }
};

exports.getRoom = async (req, res, next) => {
  try {
    const id = req.params.roomId;
    const room = await Room.findById(id);

    for (let i = 0; i < room.reviews.length; i++) {
      const foundUser = await User.findById(room.reviews[i]._doc.userId);

      room.reviews[i]._doc = {
        ...room.reviews[i]._doc,
        author: foundUser._doc.name,
        avatar: foundUser._doc.picture,
      };
    }

    if (!room) {
      return res.status(500).json({
        success: false,
        error: "",
      });
    }

    return res.status(200).json(room);
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: "",
    });
  }
};

exports.postRoom = async (req, res, next) => {
  try {
    const room = await Room.create(req.body);

    return res.status(201).json(room);
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: "",
    });
  }
};

exports.deleteRoom = async (req, res, next) => {
  try {
    const filterQuery = { _id: req.params.roomId };
    const room = await Room.findOneAndRemove(filterQuery);

    if (!room) {
      return res.status(500).json({
        success: false,
        error: "",
      });
    }

    return res.status(200).json({});
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: "",
    });
  }
};



exports.postReview = async (req, res, next) => {
  const review = {
    content: req.body.content,
    createdDate: req.body.createdDate,
    rating: req.body.rating,
    userId: req.body.userId,
  };

  const searchQuery = { _id: req.params.roomId };

  await Room.findOneAndUpdate(
    searchQuery,
    {
      $addToSet: {
        reviews: review,
      },
    },
    { new: true },
    function (err, data) {
      if (err) {
        res
          .status(500)
          .json({ message: "There was an error trying to add the review" });
      } else {
        res.status(201).json(data);
      }
    }
  );
};
