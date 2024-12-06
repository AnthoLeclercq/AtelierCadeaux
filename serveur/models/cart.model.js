const db = require("../helpers/database.js");

// Modèle pour les paniers
const Cart = function (cart) {
  this.cart_id = cart.cart_id;
  this.user_id = cart.user_id;
  this.artisan_id = cart.artisan_id;
  this.product_id = cart.product_id;
  this.total_cost = cart.total_cost;
  this.quantity = cart.quantity;
};

/************ Créer un nouveau panier ***********************/
Cart.create = (newCart, result) => {
  const insertQuery = `INSERT INTO carts (user_id, artisan_id, product_id, total_cost, quantity)
        VALUES (?, ?, ?, ?, ?)`;

  const values = [
    newCart.user_id,
    newCart.artisan_id,
    newCart.product_id,
    newCart.total_cost,
    newCart.quantity
  ];

  db.query(insertQuery, values, (err, res) => {
    if (err) {
      result({ status: 400, msg: err });
    } else {
      const createdCart = {
        cart_id: res.insertId,
        user_id: newCart.user_id,
        artisan_id: newCart.artisan_id,
        product_id: newCart.product_id,
        total_cost: newCart.total_cost,
        quantity: newCart.quantity
      };
      result(null, {
        status: 201,
        msg: "Cart added with success!",
        data: createdCart
      });
    }
  });
};

/************ Obtenir tous les paniers ***********************/
Cart.getAllCarts = (result) => {
  const selectQuery = `SELECT * FROM carts`;

  db.query(selectQuery, (err, res) => {
    if (err) {
      result({ status: 500, msg: err });
    } else {
      if (res.length === 0) {
        result(null, { status: 404, msg: "No carts found!" });
      } else {
        result(null, { status: 200, msg: "Get all carts with success!", data: res });
      }
    }
  });
};

/************ Obtenir le panier par ID ***********************/
Cart.getCartById = (cart_id, result) => {
  const selectQuery = `SELECT * FROM carts WHERE cart_id = ?`;
  const values = [cart_id];

  db.query(selectQuery, values, (err, res) => {
    if (err) {
      result(err, { status: 500, msg: err });
    } else {
      if (res.length === 0) {
        result(null, { status: 404, msg: "Cart not found!" });
      } else {
        result(null, { status: 200, msg: "Get cart with success!", data: res[0] });
      }
    }
  });
};

/************ Obtenir tous les paniers par user ID et order by artisan ID ***********************/
Cart.getAllCartsByUserIdOrderByArtisanId = (user_id, artisan_id, result) => {
  const selectQuery = `SELECT * FROM carts WHERE user_id = ? ORDER BY artisan_id = ?`;
  const values = [user_id, artisan_id];

  db.query(selectQuery, values, (err, res) => {
    if (err) {
      result(err, { status: 500, msg: err });
    } else {
      if (res.length === 0) {
        result(null, { status: 404, msg: "No carts found for the given user ID and artisan ID!" });
      } else {
        result(null, { status: 200, msg: "Get carts with success!", data: res });
      }
    }
  });
};

/************ Obtenir le panier par user ID et artisan ID ***********************/
Cart.getCartsByUserIdAndArtisanId = (user_id, artisan_id, result) => {
  const selectQuery = `SELECT * FROM carts WHERE user_id = ? AND artisan_id = ?`;
  const values = [user_id, artisan_id];

  db.query(selectQuery, values, (err, res) => {
    if (err) {
      result(err, { status: 500, msg: err });
    } else {
      if (res.length === 0) {
        result(null, { status: 404, msg: "No carts found for the given user ID and artisan ID!" });
      } else {
        result(null, { status: 200, msg: "Get carts with success!", data: res });
      }
    }
  });
};

/************ Mettre à jour le panier ***********************/
Cart.updateCart = (cart_id, updatedData, result) => {
  const updateQuery = `UPDATE carts SET ? WHERE cart_id = ?`;
  const values = [updatedData, cart_id];

  db.query(updateQuery, values, (err, res) => {
    if (err) {
      result({ status: 400, msg: err });
    } else {
      if (res.affectedRows === 0) {
        result(null, { status: 404, msg: `Cart with ID ${cart_id} not found` });
      } else {
        result(null, { status: 200, msg: `Cart with ID ${cart_id} updated successfully` });
      }
    }
  });
};

/************ Supprimer le panier ***********************/
Cart.deleteCart = (cart_id, result) => {
  const deleteQuery = `DELETE FROM carts WHERE cart_id = ?`;
  const values = [cart_id];

  db.query(deleteQuery, values, (err, res) => {
    if (err) {
      result({ status: 400, msg: err });
    } else {
      if (res.affectedRows === 0) {
        result(null, { status: 404, msg: `Cart with ID ${cart_id} not found` });
      } else {
        result(null, { status: 200, msg: `Cart with ID ${cart_id} deleted successfully` });
      }
    }
  });
};

module.exports = Cart;
