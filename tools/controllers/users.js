const User = require("../models/user");

exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find();

    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: "",
    });
  }
};

exports.getUser = async (req, res, next) => {
  try {
    const id = req.params.id;
    const user = await User.findById(id);

    if (!user) {
      return res.status(500).json({
        success: false,
        error: "User not found",
      });
    }

    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: "",
    });
  }
};

exports.changeUserName = async (req, res, next) => {
  await User.findOneAndUpdate(
    { _id: req.body.id },
    {
      $set: { name: req.body.name },
    },
    function (err, data) {
      if (err) {
        console.log(err);
        res.status(500).send({
          message: "There was an error trying to change the name.",
        });
      } else {
        res.status(200).send(data);
      }
    }
  );
};

exports.changeUserPassword = async (req, res, next) => {
  await User.findOneAndUpdate(
    { _id: req.body.id },
    {
      $set: { password: req.body.password },
    },
    function (err, data) {
      if (err) {
        console.log(err);
        res.status(500).send({
          message: "There was an error trying to change the password.",
        });
      } else {
        res.status(200).send(data);
      }
    }
  );
};

exports.changeUserPicture = async (req, res, next) => {
  await User.findOneAndUpdate(
    { _id: req.body.id },
    {
      $set: { picture: req.body.picture },
    },
    function (err, data) {
      if (err) {
        console.log(err);
        res.status(500).send({
          message: "There was an error trying to change the password.",
        });
      } else {
        res.status(200).send(data);
      }
    }
  );
};
