const Booking = require("../models/booking");
const User = require("../models/user");
const Room = require("../models/room");
const booking = require("../models/booking");

exports.getBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ userId: req.params.userId });
    return res.status(200).json(bookings);
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: "",
    });
  }
};

exports.getBookingsByHost = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ hostId: req.params.hostId });

    for (let i = 0; i < bookings.length; i++) {
      const user = await User.findOne({ _id: bookings[i].userId });
      bookings[i]._doc = {
        ...bookings[i]._doc,
        userName: user.name,
        userPicture: user.picture,
      };
    }

    return res.status(200).json(bookings);
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: "",
    });
  }
};

exports.postBooking = async (req, res, next) => {
  const booking = await Booking.create(req.body);
  const filterQuery = { _id: booking.userId };
  const roomFilterQuery = { _id: booking.roomId };

  await User.findOneAndUpdate(
    filterQuery,
    {
      $addToSet: { bookingIds: booking._id },
    },
    { new: true },
    function (err, data) {
      if (err) {
        res
          .status(500)
          .json({ message: "There was an error trying to add the booking" });
      }
    }
  );

  await Room.findOneAndUpdate(
    roomFilterQuery,
    {
      $addToSet: { bookingIds: booking._id },
    },
    { new: true },
    function (err, data) {
      if (err) {
        res
          .status(500)
          .json({ message: "There was an error trying to add the booking" });
      }
    }
  );
  res.status(201).json({});
};

exports.deleteBooking = async (req, res, next) => {
  const booking = await Booking.findById({ _id: req.params.bookingId });
  const filterQuery = { _id: booking.userId };
  const roomFilterQuery = { _id: booking.roomId };

  await Booking.deleteOne({ _id: req.params.bookingId });

  await User.updateOne(
    filterQuery,
    {
      $pull: { bookingIds: req.params.bookingId },
    },
    { new: true },
    function (err, data) {
      if (err) {
        res
          .status(500)
          .json({ message: "There was an error trying to add the booking" });
      }
    }
  );

  await Room.updateOne(
    roomFilterQuery,
    {
      $pull: { bookingIds: req.params.bookingId },
    },
    { new: true },
    function (err, data) {
      if (err) {
        res
          .status(500)
          .json({ message: "There was an error trying to add the booking" });
      }
    }
  );

  res.status(201).json({});
};
