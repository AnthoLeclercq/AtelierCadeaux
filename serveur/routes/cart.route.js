const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cart.controller.js");
const { authenticateAndCheckRole } = require("../helpers/authHelper.js");
const roleClient = "client";

// Créer un nouveau panier (requiert l'authentification et le rôle de client)
router.post(
  "/:user_id",
  authenticateAndCheckRole(roleClient),
  cartController.createCart
);

// Obtenir tous les paniers
router.get("", cartController.getAllCarts);

// Obtenir le panier par ID
router.get("/:cart_id", cartController.getCartById);

// Obtenir le panier par user ID
router.get("/:user_id/all", cartController.getAllCartsByUserIdOrderByArtisanId);

// Obtenir le panier par user ID et artisan ID
router.get("/:user_id/:artisan_id", cartController.getCartsByUserIdAndArtisanId);

// Mettre à jour le panier par ID (requiert l'authentification et le rôle de client)
router.put(
  "/:cart_id",
  authenticateAndCheckRole(roleClient),
  cartController.updateCart
);

// Supprimer le panier par ID (requiert l'authentification et le rôle de client)
router.delete(
  "/:cart_id",
  authenticateAndCheckRole(roleClient),
  cartController.deleteCart
);

module.exports = router;
