const express = require("express");

const ObjectID = require("mongodb").ObjectID;
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const Test = require("../models/test");
const User = require("../models/user");

const jwt = require("jsonwebtoken");
const checkAuth = require("../middleware/check-auth");
const bcrypt = require("bcrypt");
const bcryptjs = require("bcryptjs");

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const { getTests, getTest, deleteTest } = require("../controllers/test");
const { getLocations, getLocation } = require("../controllers/locations");
const {
  getRooms,
  getRoom,
  postRoom,
  deleteRoom,
  getReviews,
  postReview,
} = require("../controllers/room");

const {
  getUsers,
  getUser,
  postUser,

  changeUserName,
  changeUserPassword,
  changeUserPicture,
} = require("../controllers/users");

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

app.post("/test", async (req, res, next) => {
  try {
    const test = await Test.create(req.body);
    return res.status(201).json({
      success: true,
      data: test,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: "",
    });
  }
});

app.get("/test", (req, res) => {
  return getTests(req, res);
});

app.get("/test/:id", (req, res) => {
  return getTest(req, res);
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

app.get("/location/:locationId/rooms", (req, res) => {
  return getRooms(req, res);
});

app.post("/location/:locationId/rooms", (req, res) => {
  return postRoom(req, res);
});

app.get("/location/:locationId/rooms/:roomId", (req, res) => {
  return getRoom(req, res);
});

app.delete("/location/:locationId/rooms/:roomId", (req, res) => {
  return deleteRoom(req, res);
});

app.post("/location/:locationId/rooms/:roomId", (req, res) => {
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

app.delete("/test/:id", (req, res) => {
  return deleteTest(req, res);
});

app.listen(3000, () => console.log("listening"));
