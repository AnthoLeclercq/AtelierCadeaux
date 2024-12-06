const User = require("../models/user.model.js");

const register = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({ message: "Content can not be empty!" });
  }

  // Create a User
  const user = {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    role: req.body.role,
    address: req.body.address,
    city: req.body.city,
    zipcode: req.body.zipcode,
  };

  // Save User in the database
  User.create(user, (err, data) => {
    if (err)
      return res.status(500).send({
        message:
          err.message || "Some error occurred while creating the User.",
      });
    else {
      if (data.status == 201) {
        return res.status(data.status).send({
          data,
        });
      }
      return res.status(data.status).send({ message: data.msg });
    }
  });
};

const login = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({ message: "Content can not be empty!" });
  }

  // Create a AuthUser
  const AuthUser = {
    email: req.body.email,
    password: req.body.password,
  };

  User.auth(AuthUser, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the User.",
      });
    else {
      if (data.status == 201) {
        return res
          .status(data.status)
          .cookie("auth_token", data.data, { maxAge: 3600000, httpOnly: true })
          .send({
            message: data.msg,
            data: {
              token: data.data,
              user_id: data.user_id,
              name: data.name,
              email: data.email,
              role: data.role,
              address: data.address,
              city: data.city,
              zipcode: data.zipcode,
              profession: data.profession,
              is_deleted: data.is_deleted
            },
          });
      }
      return res.status(data.status).send({ message: data.msg });
    }
  });
};

module.exports = { login, register };
