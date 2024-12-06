const express = require("express");
const router = express.Router();
const favoriteController = require("../controllers/favorite.controller.js");
const { authenticateAndCheckRole } = require("../helpers/authHelper.js");
const roleClient = "client";

// Créer un nouveau favori (requiert l'authentification et le rôle de client)
router.post(
  "/:user_id",
  authenticateAndCheckRole(roleClient),
  favoriteController.createFavorite
);

// Obtenir tous les favoris
router.get("", favoriteController.getAllFavorites);

// Obtenir le favori par ID
router.get("/:fav_id", favoriteController.getFavoriteById);

// Obtenir tous les favoris par User ID
router.get("/user/:user_id", favoriteController.getAllFavoritesByUserId);

// Mettre à jour le favori par ID (requiert l'authentification et le rôle de client)
router.put(
  "/:fav_id",
  authenticateAndCheckRole(roleClient),
  favoriteController.updateFavorite
);

// Supprimer le favori par ID (requiert l'authentification et le rôle de client)
router.delete(
  "/:fav_id",
  authenticateAndCheckRole(roleClient),
  favoriteController.deleteFavorite
);

module.exports = router;
