const jwt = require("jsonwebtoken");
const db = require("../helpers/database.js");
const authHelper = require('../helpers/authHelper.js');

// constructor
const User = function (user) {
  this.user_id = user.user_id;
  this.name = user.name;
  this.email = user.email;
  this.role = user.role;
  this.address = user.address;
  this.city = user.city;
  this.zipcode = user.zipcode;
  this.profession = user.profession;
  this.image_profile = user.image_profile;
  this.image_bg = user.image_bg;
  this.images_detail = user.images_detail;
  this.description = user.description;
  this.is_deleted = user.is_deleted;
};

/************ Create and Save a new User ***********************/
User.create = (newUser, result) => {
  authHelper.encryptPassword(newUser.password)
    .then(hash => {
      const insertQuery = `INSERT INTO users (name, email, password, role, address, city, zipcode, profession)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

      db.query(
        insertQuery,
        [
          newUser.name,
          newUser.email,
          hash,
          newUser.role,
          newUser.address,
          newUser.city,
          newUser.zipcode,
          newUser.profession
        ],
        (err, res) => {
          if (err) {
            result(err, { status: 400, msg: err });
            return;
          }

          const createdUser = {
            user_id: res.insertId,
            name: newUser.name,
            email: newUser.email,
            role: newUser.role,
            address: newUser.address,
            city: newUser.city,
            zipcode: newUser.zipcode,
            profession: newUser.profession
          };

          const token = jwt.sign(
            { user_id: res.insertId, role: newUser.role },
            "the-super-strong-secret",
            { expiresIn: "30d" }
          );

          result(null, {
            status: 201,
            msg: "User added with success!",
            data: createdUser,
            token: token,
          });
        }
      );
    })
    .catch(err => {
      result(err, { status: 500, msg: err.message });
    });
};

/****************** Auth **********************/
User.auth = (AuthUser, result) => {
  const selectQuery = "SELECT * FROM users WHERE email = ?";

  db.query(selectQuery, [AuthUser.email], (err, res) => {
    if (err) {
      result(err, { status: 400, msg: err });
      return;
    }

    if (!res.length) {
      result(null, { status: 401, msg: "Email or password is incorrect!" });
      return;
    }

    authHelper.comparePassword(AuthUser.password, res[0].password)
      .then(bResult => {
        if (bResult) {
          const token = jwt.sign(
            {
              user_id: res[0].user_id,
              role: res[0].role,
              name: res[0].name,
              email: res[0].email,
              address: res[0].address,
              city: res[0].city,
              zipcode: res[0].zipcode,
              profession: res[0].profession,
              is_deleted: res[0].is_deleted
            },
            "the-super-strong-secret",
            { expiresIn: "30d" }
          );

          result(null, {
            status: 201,
            msg: "Login with success!",
            data: token,
            user_id: res[0].user_id,
            role: res[0].role,
            name: res[0].name,
            email: res[0].email,
            address: res[0].address,
            city: res[0].city,
            zipcode: res[0].zipcode,
            profession: res[0].profession,
            is_deleted: res[0].is_deleted
          });
        } else {
          result(null, { status: 401, msg: "Email or password is incorrect!" });
        }
      })
      .catch(err => {
        result(err, { status: 401, msg: "Email or password is incorrect!" });
      });
  });
};

/****************** Get user by id***************************/
User.getUserByID = (user_id, result) => {
  const selectQuery = `SELECT * FROM users WHERE user_id = ?`;
  const values = [user_id];

  db.query(selectQuery, values, (err, res) => {
    if (err) {
      result({ status: 500, msg: err });
    } else {
      if (res.length === 0) {
        result({ status: 404, msg: `User with ID ${user_id} not found!` });
      } else {
        result({
          status: 200,
          msg: "Get user with success!",
          data: new User(res[0]),
        });
      }
    }
  });
};

/********************* Get user by email  *******************/
User.getUserByEmail = (email, result) => {
  const query = 'SELECT * FROM users WHERE email = ?';
  db.query(query, [email], (err, res) => {
    if (err) {
      result(err, { status: 500, msg: 'Error retrieving user' });
    } else if (res.length === 0) {
      result(null, { status: 404, msg: 'User not found' });
    } else {
      result(null, { status: 200, data: new User(res[0]) });
    }
  });
};

/****************** Get All Users***************************/
User.getAllUsers = (result) => {
  const selectQuery = "SELECT * FROM users";

  db.query(selectQuery, (err, res) => {
    if (err) {
      console.error("Error retrieving users");
      result(err, null);
      return;
    }

    const users = res.map((userData) => new User(userData));

    result(null, {
      status: 200,
      msg: "Get all users with success!",
      data: users,
    });
  });
};

/********************* Update user *******************/
User.updateUserByID = async (user_id, userUpdate, result) => {
  try {
    let setClause = [];
    let values = [];

    // Iterate over userUpdate fields
    for (const [key, value] of Object.entries(userUpdate)) {
      if (key === 'password') {
        const hashedPassword = await authHelper.encryptPassword(value);
        setClause.push(`${key} = ?`);
        values.push(hashedPassword);
      } else if (key === 'images_detail') {
        setClause.push(`${key} = ?`);
        values.push(JSON.stringify(value));
      } else {
        setClause.push(`${key} = ?`);
        values.push(value);
      }
    }

    values.push(user_id);

    const updateQuery = `UPDATE users SET ${setClause.join(', ')} WHERE user_id = ?`;

    db.query(updateQuery, values, (err, updateRes) => {
      if (err) {
        console.error("Error updating user:", err);
        return result(err, null);
      }

      const selectQuery = `SELECT * FROM users WHERE user_id = ?`;

      db.query(selectQuery, [user_id], (err, selectRes) => {
        if (err) {
          console.error("Error retrieving updated user:", err);
          return result(err, null);
        }

        if (selectRes.length === 0) {
          return result(null, {
            status: 404,
            msg: `Updated user with ID ${user_id} not found`,
          });
        }

        const updatedUser = selectRes[0];

        result(null, {
          status: 200,
          msg: `User with ID ${user_id} updated successfully`,
          data: new User(updatedUser),
        });
      });
    });
  } catch (err) {
    console.error("Error processing update:", err);
    result(err, null);
  }
};

/********************* Delete user by ID *******************/
User.deleteUserByID = (user_id, result) => {
  const query = `DELETE FROM users WHERE user_id = ?`;
  const values = [user_id];

  db.query(query, values, (err, res) => {
    if (err) {
      console.error("Error deleting user:", err);
      return result(err, null);
    }

    if (res.affectedRows === 0) {
      return result(null, {
        status: 404,
        msg: `User with ID ${user_id} not found`,
      });
    }

    result(null, {
      status: 200,
      msg: `User with ID ${user_id} deleted successfully`,
    });
  });
};

/********************* Delete user image by type *******************/
User.deleteImageByType = (user_id, imageType, imageUrl, result) => {
  let updateQuery;
  let values = [user_id, imageUrl];

  if (imageType === "image_profile" || imageType === "image_bg") {
    // For image_profile and image_bg, we set the column to NULL
    updateQuery = `UPDATE users SET ${imageType} = NULL WHERE user_id = ?`;
    db.query(updateQuery, values, (err, res) => {
      if (err) {
        console.error("Error updating user:", err);
        return result(err, null);
      }

      result(null, {
        status: 200,
        msg: `User image of type ${imageType} deleted successfully`,
      });
    });
  } else if (imageType === "images_detail" && imageUrl) {
    const selectQuery = `SELECT images_detail FROM users WHERE user_id = ?`;

    db.query(selectQuery, [user_id], (err, res) => {
      if (err) {
        console.error("Error retrieving user:", err);
        return result(err, null);
      }

      if (res.length === 0) {
        return result(null, { status: 404, msg: `User with ID ${user_id} not found` });
      }

      let imagesDetail = res[0].images_detail;

      // Check if imagesDetail is a string that needs parsing
      if (typeof imagesDetail === 'string') {
        try {
          imagesDetail = JSON.parse(imagesDetail);
        } catch (parseErr) {
          return result(null, { status: 500, msg: `Error parsing images_detail: ${parseErr.message}` });
        }
      }

      if (!Array.isArray(imagesDetail)) {
        return result(null, { status: 500, msg: `Invalid format for images_detail` });
      }

      const indexToRemove = imagesDetail.indexOf(imageUrl);

      if (indexToRemove > -1) {
        imagesDetail.splice(indexToRemove, 1);
      } else {
        return result(null, { status: 400, msg: `Image URL not found in images_detail` });
      }

      updateQuery = `UPDATE users SET images_detail = ? WHERE user_id = ?`;
      values = [JSON.stringify(imagesDetail), user_id];

      db.query(updateQuery, values, (err, res) => {
        if (err) {
          console.error("Error updating user:", err);
          return result(err, null);
        }

        result(null, {
          status: 200,
          msg: `Image ${imageUrl} removed from images_detail successfully`,
        });
      });
    });

    return;
  } else {
    return result(null, { status: 400, msg: `Invalid image type` });
  }
};

module.exports = User;
