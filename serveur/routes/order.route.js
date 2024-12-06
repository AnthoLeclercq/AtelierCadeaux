const express = require("express");
const router = express.Router();
const orderController = require("../controllers/order.controller.js");
const { authenticateAndCheckRole } = require("../helpers/authHelper.js");
const roleClient = "client";
const roleArtisan = "artisan";

// Create new order (requires authentication and client role)
router.post(
  "/:user_id",
  authenticateAndCheckRole(roleClient),
  orderController.createOrder
);

// Get all orders
router.get("", orderController.getAllOrders);

// Get order by ID
router.get("/:order_id", orderController.getOrderById);

// Get order details by order ID
router.get("/:order_id/details", orderController.getOrderDetailsById);

// Obtenir la commande par user ID
router.get("/:user_id/all", orderController.getAllOrdersByUserIdOrderByArtisanId);

// Obtenir la commande par user ID et artisan ID
router.get("/:user_id/:artisan_id", orderController.getOrdersByUserIdAndArtisanId);

// Update order by ID (requires authentication and client role)
router.put(
  "/:order_id",
  orderController.updateOrder
);

// Delete order by ID (requires authentication and client role)
router.delete(
  "/:order_id",
  authenticateAndCheckRole(roleClient),
  orderController.deleteOrder
);

module.exports = router;
