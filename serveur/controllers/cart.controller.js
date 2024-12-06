const Cart = require("../models/cart.model.js");

/************ Créer un nouveau panier ***********************/
exports.createCart = (req, res) => {
  const newCart = {
    user_id: req.params.user_id,
    artisan_id: req.body.artisan_id,
    product_id: req.body.product_id,
    total_cost: req.body.total_cost,
    quantity: req.body.quantity
  };

  Cart.create(newCart, (err, response) => {
    if (err) {
      return res.status(response.status).json({ message: response.msg });
    }
    res.status(response.status).json({ data: response.data, message: response.msg });
  });
};

/************ Obtenir tous les paniers ***********************/
exports.getAllCarts = (req, res) => {
  Cart.getAllCarts((err, response) => {
    if (err) {
      return res.status(response.status).json({ message: response.msg });
    }
    res.status(response.status).json({ data: response.data, message: response.msg });
  });
};

/************ Obtenir le panier par ID ***********************/
exports.getCartById = (req, res) => {
  const cart_id = req.params.cart_id;
  Cart.getCartById(cart_id, (err, response) => {
    if (err) {
      return res.status(response.status).json({ message: response.msg });
    }
    res.status(response.status).json({ data: response.data, message: response.msg });
  });
};

/************ Obtenir tous les paniers par User ID order by artisan ID ***********************/
exports.getAllCartsByUserIdOrderByArtisanId = (req, res) => {
  const user_id = req.params.user_id;
  const artisan_id = req.body.artisan_id;

  Cart.getAllCartsByUserIdOrderByArtisanId(user_id, artisan_id, (err, response) => {
    if (err) {
      return res.status(response.status).json({ message: response.msg });
    }
    res.status(response.status).json({ data: response.data, message: response.msg });
  });
};

/************ Obtenir le panier par User ID et artisan ID ***********************/
exports.getCartsByUserIdAndArtisanId = (req, res) => {
  const user_id = req.params.user_id;
  const artisan_id = req.params.artisan_id;

  Cart.getCartsByUserIdAndArtisanId(user_id, artisan_id, (err, response) => {
    if (err) {
      return res.status(response.status).json({ message: response.msg });
    }
    res.status(response.status).json({ data: response.data, message: response.msg });
  });
};

/************ Mettre à jour le panier par ID ***********************/
exports.updateCart = (req, res) => {
  const cart_id = req.params.cart_id;
  const updatedData = req.body;

  Cart.updateCart(cart_id, updatedData, (err, response) => {
    if (err) {
      return res.status(response.status).json({ message: response.msg });
    }
    res.status(response.status).json({ message: response.msg });
  });
};

/************ Supprimer le panier par ID ***********************/
exports.deleteCart = (req, res) => {
  const cart_id = req.params.cart_id;

  Cart.deleteCart(cart_id, (err, response) => {
    if (err) {
      return res.status(response.status).json({ message: response.msg });
    }
    res.status(response.status).json({ message: response.msg });
  });
};
