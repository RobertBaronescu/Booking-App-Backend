const express = require("express");

const ObjectID = require("mongodb").ObjectID;
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const User = require("../models/user");

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

app.use(cors());
app.use(bodyParser.json({ limit: "50mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

const {
  getLocations,
  getLocation,
  getLocationByRoomId,
} = require("../controllers/locations");
const {
  getRooms,
  getRoom,
  postRoom,
  deleteRoom,
  postReview,
  getRoomsByHost,
  editRoom,
  getMostReviewedRooms,
  getBestRatedRooms,
} = require("../controllers/room");

const {
  getUsers,
  getUser,
  changeUserName,
  changeUserPassword,
  changeUserPicture,
} = require("../controllers/users");

const {
  postBooking,
  getBookings,
  deleteBooking,
  getBookingsByHost,
} = require("../controllers/bookings");

mongoose
  .connect(
    "mongodb+srv://user:Fishbone1@cluster0.xnzms.mongodb.net/application?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => {
    console.log("connected successfully");
  })
  .catch(() => {
    console.log("not connected");
  });

app.get("/rooms/best-rated", (req, res) => {
  return getBestRatedRooms(req, res);
});

app.get("/locations", (req, res) => {
  return getLocations(req, res);
});

app.get("/location/:id", (req, res) => {
  return getLocation(req, res);
});

app.get("/users", (req, res) => {
  return getUsers(req, res);
});

app.get("/users/:id", (req, res) => {
  return getUser(req, res);
});

app.post("/user/personal-info", (req, res) => {
  return changeUserName(req, res);
});

app.post("/user/personal-info/userPicture", (req, res) => {
  return changeUserPicture(req, res);
});

app.post("/user/login-security", (req, res) => {
  return changeUserPassword(req, res);
});

app.get("/rooms", (req, res) => {
  return getRooms(req, res);
});

app.get("/rooms/:roomId", (req, res) => {
  return getRoom(req, res);
});

app.put("/room/edit/:roomId", (req, res) => {
  return editRoom(req, res);
});

app.get("/rooms/location/:roomId", (req, res) => {
  return getLocationByRoomId(req, res);
});

app.get("/rooms/host/:hostId", (req, res) => {
  return getRoomsByHost(req, res);
});

app.post("/rooms/add-room", (req, res) => {
  return postRoom(req, res);
});

app.delete("/room/:roomId/delete-room", (req, res) => {
  return deleteRoom(req, res);
});

app.post("/room/:roomId/add-review", (req, res) => {
  return postReview(req, res);
});

app.post("/register", async (req, res, next) => {
  const user = await User.create(req.body);

  user.password = await bcrypt.hash(req.body.password, 10);

  const token = jwt.sign(
    { email: user.email, userId: user._id },
    "new_token_created",
    { expiresIn: "1h" }
  );

  user
    .save()
    .then((result) => {
      res.status(201).json({ ...result, token: token });
    })
    .catch((err) => {
      res.status(500).json({ error: "not working" });
    });
});

app.post("/login", async (req, res, next) => {
  const user = await User.findOne({
    email: req.body.email,
  });

  if (!user) {
    return res.status(401).json({
      message: "Auth failed",
    });
  }

  const match = await bcrypt.compare(req.body.password, user.password);

  if (match) {
    const token = jwt.sign(
      { email: user.email, userId: user._id },
      "new_token_created",
      { expiresIn: "1h" }
    );

    res.status(200).json({ ...user._doc, token: token });
  } else {
    res.status(401).json({
      message: "Wrong credentials",
    });
  }
});

app.post("/booking/success", async (req, res) => {
  return postBooking(req, res);
});

app.get("/bookings/:userId", async (req, res) => {
  return getBookings(req, res);
});

app.get("/bookings/rooms/host/:hostId", (req, res) => {
  return getBookingsByHost(req, res);
});

app.delete("/user/user-bookings/:bookingId", async (req, res) => {
  return deleteBooking(req, res);
});

app.listen(3000, () => console.log("listening"));
