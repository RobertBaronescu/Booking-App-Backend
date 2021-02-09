const Test = require("../models/test");

exports.getTests = async (req, res, next) => {
  try {
    const test = await Test.find();
    console.log("fetched users");
    return res.status(200).json({
      success: true,
      data: test,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: "",
    });
  }
};

exports.getTest = async (req, res, next) => {
  try {
    const test = await Test.findById(req.params.id);
    console.log("fetched user");
    if (!test) {
      return res.status(500).json({
        success: false,
        error: "",
      });
    }
    return res.status(200).json({
      success: true,
      data: test,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: "",
    });
  }
};

// exports.getRoomsByBatch = async (req, res, next) => {
  
//     try {
//       const videos = await Video.find(
//       )
//         .sort({ createdAt: -1 })
//         .limit(6)
//         .skip(6)
//         .exec();
  
//       return res.status(200).json({
//         success: true,
//         data: videos,
//       });
//     } catch (err) {
//       return res.status(500).json({
//         success: false,
//         error: "Server Error",
//       });
//     }
//   };
  

exports.deleteTest = async (req, res, next) => {
  try {
    const test = await Test.findById(req.params.id);
    console.log("deleted user");
    if (!test) {
      return res.status(500).json({
        success: false,
        error: "",
      });
    }
    await test.remove();
    return res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: "",
    });
  }
};
