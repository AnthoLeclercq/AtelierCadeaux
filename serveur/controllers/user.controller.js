const User = require("../models/user.model.js");
const Product = require("../models/product.model.js");

/**************** Get a list of all users ********************/
exports.getAllUsers = (req, res) => {
  User.getAllUsers((err, data) => {
    if (err) {
      res.status(400).send({
        message: err
      });
    } else {
      res.status(data.status).send({
        status: data.status,
        message: data.msg,
        data: data.data,
      });
    }
  });
};

/****************** Get user by ID ***************************/
exports.getUserById = (req, res) => {
  const user_id = req.params.id;
  User.getUserByID(user_id, (response) => {
    if (response.status !== 200) {
      return res.status(response.status).json({ status: response.status, message: response.msg });
    }

    return res.status(response.status).json({ status: response.status, message: response.msg, data: response.data });
  });
};

/****************** Get user by email ***************************/
exports.getUserByEmail = (req, res) => {
  const { email } = req.params;

  User.getUserByEmail(email, (err, result) => {
    if (err) {
      return res.status(result.status).json({ message: result.msg });
    }

    if (result.status === 404) {
      return res.status(result.status).json({ message: result.msg });
    }

    res.status(result.status).json({
      status: result.status,
      message: 'User retrieved successfully',
      data: result.data
    });
  });
};

/********************* Update user *******************/
exports.updateUser = async (req, res) => {
  const userIdToUpdate = req.params.id;
  const userUpdate = req.body;

  const validFields = [
    "name", "email", "address", "city", "zipcode", "profession",
    "description", "image_profile", "image_bg", "images_detail",
    "password", "is_deleted"
  ];

  const keys = Object.keys(userUpdate);

  for (const key of keys) {
    if (!validFields.includes(key)) {
      return res.status(400).json({ status: 400, message: "Bad request: invalid JSON key." });
    }
  }

  try {
    User.updateUserByID(userIdToUpdate, userUpdate, (err, response) => {
      if (err) {
        return res.status(500).json({ message: err });
      }
      res.status(response.status).json({
        status: response.status,
        message: response.msg,
        data: response.data,
      });
    });
  } catch (err) {
    console.error("Error during user update:", err);
    res.status(500).json({ status: 500, message: "Internal server error." });
  }
};

/******************* Delete user **************************/
exports.deleteUser = (req, res) => {
  const user_id = req.params.id;

  User.deleteUserByID(user_id, (err, response) => {
    if (err) {
      return res.status(response.status).json({ status: response.status, message: response.msg });
    }
    res.status(response.status).json({ status: response.status, message: response.msg });
  });
};

/****************** Get user's products ***************************/
exports.getProductsByUserId = (req, res) => {
  const user_id = req.params.id;
  User.getUserByID(user_id, (response) => {
    if (response.status !== 200) {
      return res.status(response.status).json({ message: response.msg });
    }

    Product.getProductByUserID(user_id, (response) => {
      return res.status(response.status).json(response);
    });
  });
};

/********************* Delete user image by type *******************/
exports.deleteUserImageByType = (req, res) => {
  const user_id = req.params.id;
  const imageType = req.params.type;
  const imageUrl = req.body.imageUrl; // The URL of the image to delete

  if (!imageType)
    return res.status(400).json({ status: 400, message: "Image type is required" });

  if (imageType === "images_detail" && !imageUrl)
    return res.status(400).json({ status: 400, message: "Image URL is required for images_detail" });

  User.deleteImageByType(user_id, imageType, imageUrl, (err, response) => {
    if (err) {
      return res.status(response.status || 500).json({ status: response.status || 500, message: err.message || response.msg });
    }
    res.status(response.status).json({ status: response.status, message: response.msg });
  });
};
