const express = require('express');
const router = express.Router();
const userController = require("../controllers/user.controller.js");
const { authenticateAndCheckRole } = require('../helpers/authHelper.js');

// Get all users
router.get('', userController.getAllUsers);

// Get user by ID
router.get('/:id', userController.getUserById);

// Get user by email
router.get('/email/:email', userController.getUserByEmail);

// Update user by ID (requires authentication and user role)
router.put('/:id', authenticateAndCheckRole(), userController.updateUser);

// Delete user by ID (requires authentication and user role)
router.delete('/:id', authenticateAndCheckRole(), userController.deleteUser);

// Get product by User ID
router.get('/:id/products', userController.getProductsByUserId);

// Delete user image by Type
router.delete('/:id/:type', userController.deleteUserImageByType);

module.exports = router;
