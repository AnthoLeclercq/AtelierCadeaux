const db = require("../helpers/database.js");

// Modèle pour les favoris
const Favorite = function (favorite) {
  this.fav_id = favorite.fav_id;
  this.fav_user = favorite.fav_user;
  this.fav_product = favorite.fav_product;
  this.fav_business = favorite.fav_business;
};

/************ Créer un nouveau favori ***********************/
Favorite.create = (newFavorite, result) => {
  const insertQuery = `INSERT INTO favorites (fav_user, fav_product, fav_business)
        VALUES (?, ?, ?)`;

  const values = [
    newFavorite.fav_user,
    newFavorite.fav_product,
    newFavorite.fav_business
  ];

  db.query(insertQuery, values, (err, res) => {
    if (err) {
      result({ status: 400, msg: err });
    } else {
      const createdFavorite = {
        fav_id: res.insertId,
        fav_user: newFavorite.fav_user,
        fav_product: newFavorite.fav_product,
        fav_business: newFavorite.fav_business
      };
      result(null, {
        status: 201,
        msg: "Favorite added with success!",
        data: createdFavorite
      });
    }
  });
};

/************ Obtenir tous les favoris ***********************/
Favorite.getAllFavorites = (result) => {
  const selectQuery = `SELECT * FROM favorites`;

  db.query(selectQuery, (err, res) => {
    if (err) {
      result({ status: 500, msg: err });
    } else {
      if (res.length === 0) {
        result(null, { status: 404, msg: "No favorites found!" });
      } else {
        result(null, { status: 200, msg: "Get all favorites with success!", data: res });
      }
    }
  });
};

/************ Obtenir le favori par ID ***********************/
Favorite.getFavoriteById = (fav_id, result) => {
  const selectQuery = `SELECT * FROM favorites WHERE fav_id = ?`;
  const values = [fav_id];

  db.query(selectQuery, values, (err, res) => {
    if (err) {
      result(err, { status: 500, msg: err });
    } else {
      if (res.length === 0) {
        result(null, { status: 404, msg: "Favorite not found!" });
      } else {
        result(null, { status: 200, msg: "Get favorite with success!", data: res[0] });
      }
    }
  });
};

/************ Obtenir tous les favoris par User ID ***********************/
Favorite.getAllFavoritesByUserId = (user_id, result) => {
  const selectQuery = `SELECT * FROM favorites WHERE fav_user = ?`;
  const values = [user_id];

  db.query(selectQuery, values, (err, res) => {
    if (err) {
      result(err, { status: 500, msg: err });
    } else {
      if (res.length === 0) {
        result(null, { status: 404, msg: "No favorites found for the given user ID!" });
      } else {
        result(null, { status: 200, msg: "Get favorites with success!", data: res });
      }
    }
  });
};

/************ Mettre à jour le favori ***********************/
Favorite.updateFavorite = (fav_id, updatedData, result) => {
  const updateQuery = `UPDATE favorites SET ? WHERE fav_id = ?`;
  const values = [updatedData, fav_id];

  db.query(updateQuery, values, (err, res) => {
    if (err) {
      result({ status: 400, msg: err });
    } else {
      if (res.affectedRows === 0) {
        result(null, { status: 404, msg: `Favorite with ID ${fav_id} not found` });
      } else {
        result(null, { status: 200, msg: `Favorite with ID ${fav_id} updated successfully` });
      }
    }
  });
};

/************ Supprimer le favori ***********************/
Favorite.deleteFavorite = (fav_id, result) => {
  const deleteQuery = `DELETE FROM favorites WHERE fav_id = ?`;
  const values = [fav_id];

  db.query(deleteQuery, values, (err, res) => {
    if (err) {
      result({ status: 400, msg: err });
    } else {
      if (res.affectedRows === 0) {
        result(null, { status: 404, msg: `Favorite with ID ${fav_id} not found` });
      } else {
        result(null, { status: 200, msg: `Favorite with ID ${fav_id} deleted successfully` });
      }
    }
  });
};

module.exports = Favorite;
