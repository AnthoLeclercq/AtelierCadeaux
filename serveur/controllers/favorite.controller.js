const Favorite = require("../models/favorite.model.js");

/************ Créer un nouveau favori ***********************/
exports.createFavorite = (req, res) => {
  const newFavorite = {
    fav_user: req.params.user_id,
    fav_product: req.body.product_id || null,
    fav_business: req.body.artisan_id || null
  };

  // Validation logic: Ensure only one of fav_product or fav_business is set
  if ((newFavorite.fav_product && newFavorite.fav_business) || (!newFavorite.fav_product && !newFavorite.fav_business)) {
    return res.status(400).json({
      message: 'Either fav_product or fav_business must be set, not both or neither'
    });
  }

  Favorite.create(newFavorite, (err, response) => {
    console.log(response, newFavorite)
    if (err) {
      return res.status(response.status).json({ message: response.msg });
    }
    res.status(response.status).json({ data: response.data, message: response.msg, status: response.status });
  });
};

/************ Obtenir tous les favoris ***********************/
exports.getAllFavorites = (req, res) => {
  Favorite.getAllFavorites((err, response) => {
    if (err) {
      return res.status(response.status).json({ message: response.msg });
    }
    res.status(response.status).json({ data: response.data, message: response.msg });
  });
};

/************ Obtenir le favori par ID ***********************/
exports.getFavoriteById = (req, res) => {
  const fav_id = req.params.fav_id;
  Favorite.getFavoriteById(fav_id, (err, response) => {
    if (err) {
      return res.status(response.status).json({ message: response.msg });
    }
    res.status(response.status).json({ data: response.data, message: response.msg });
  });
};

/************ Obtenir tous les favoris par User ID ***********************/
exports.getAllFavoritesByUserId = (req, res) => {
  const user_id = req.params.user_id;

  Favorite.getAllFavoritesByUserId(user_id, (err, response) => {
    if (err) {
      return res.status(response.status).json({ message: response.msg });
    }
    res.status(response.status).json({ data: response.data, message: response.msg });
  });
};

/************ Mettre à jour le favori par ID ***********************/
exports.updateFavorite = (req, res) => {
  const fav_id = req.params.fav_id;
  const updatedData = req.body;

  Favorite.updateFavorite(fav_id, updatedData, (err, response) => {
    if (err) {
      return res.status(response.status).json({ message: response.msg });
    }
    res.status(response.status).json({ message: response.msg });
  });
};

/************ Supprimer le favori par ID ***********************/
exports.deleteFavorite = (req, res) => {
  const fav_id = req.params.fav_id;

  Favorite.deleteFavorite(fav_id, (err, response) => {
    if (err) {
      return res.status(response.status).json({ message: response.msg });
    }
    res.status(response.status).json({ message: response.msg });
  });
};
