const Room = require("../models/room");
const User = require("../models/user");
const Booking = require("../models/booking");
const Location = require("../models/location");
const shortUrl = require("node-url-shortener");

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

exports.getRoomsByHost = async (req, res, next) => {
  try {
    const rooms = await Room.find({ hostId: String(req.params.hostId) });
    const host = await User.findOne({ _id: req.params.hostId });

    for (let i = 0; i < rooms.length; i++) {
      rooms[i]._doc = {
        ...rooms[i]._doc,
        hostPicture: host.picture,
      };
    }

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

    const room = await Room.findById({ _id: id });
    const reservations = [];
    const host = await User.findOne({ _id: room.hostId });

    for (let i = 0; i < room.reviews.length; i++) {
      const foundUser = await User.findById(room.reviews[i]._doc.userId);

      room.reviews[i]._doc = {
        ...room.reviews[i]._doc,
        author: foundUser._doc.name,
        avatar: foundUser._doc.picture,
      };
    }

    for (let i = 0; i < room.bookingIds.length; i++) {
      const foundBooking = await Booking.findById(room.bookingIds[i]);
      const period = {
        startDate: foundBooking.startDate,
        endDate: foundBooking.endDate,
      };

      reservations.push(period);
    }

    if (!room) {
      return res.status(500).json({
        success: false,
        error: "",
      });
    }

    return res.status(200).json({
      ...room._doc,
      reservations,
      hostName: host.name,
      hostPicture: host.picture,
    });
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

    await Location.findOneAndUpdate(
      { _id: req.body.locationId },
      {
        $addToSet: { roomIds: room._id },
      },
      { new: true }
    );

    await User.findOneAndUpdate(
      { _id: req.body.hostId },
      {
        $addToSet: { roomIds: room._id },
      },
      { new: true }
    );

    return res.status(201).json({});
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: "",
    });
  }
};

exports.editRoom = async (req, res) => {
  try {
    await Room.updateOne(
      { _id: req.params.roomId },
      {
        $set: {
          name: req.body.name,
          address: req.body.address,
          intro: req.body.intro,
          description: req.body.description,
          interactionWithGuests: req.body.interactionWithGuests,
          price: req.body.price,
          thumbnail: req.body.thumbnail,
          photos: req.body.photos,
        },
      },
      {
        upsert: false,
      }
    );
    return res.status(200).json({});
  } catch (error) {
    return res
      .status(500)
      .json({ message: "There was a problem trying to update the room" });
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
  let updatedRating = "";

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
        const ratings = data.reviews.map(({ rating }) => Number(rating));
        const ratingsSum = ratings.reduce((acc, current) => acc + current, 0);

        updatedRating = Number(ratingsSum / ratings.length);
      }
    }
  );

  await Room.updateOne(
    searchQuery,
    {
      $set: { rating: updatedRating },
    },
    { new: true },
    function (err, rating) {
      if (err) {
        res
          .status(500)
          .json({ message: "There was an error trying to updated the rating" });
      } else {
        res.status(201).json({});
      }
    }
  );
};
