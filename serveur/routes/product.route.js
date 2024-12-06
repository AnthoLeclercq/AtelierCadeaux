const express = require("express")
const router = express.Router()
const productController = require("../controllers/product.controller.js")
const { authenticateAndCheckRole } = require("../helpers/authHelper.js")
const roleArtisan = "artisan"

// Create new product (requires authentication and artisan role)
router.post(
  "/:artisan_id",
  authenticateAndCheckRole(roleArtisan),
  productController.addProduct
)

// Get all products
router.get("", productController.getAllProducts)

// Get product by ID
router.get("/:product_id", productController.getProductById)

// Update product by ID (requires authentication and artisan role, and verifies the user's ID)
router.put(
  "/:product_id",
  authenticateAndCheckRole(roleArtisan),
  productController.updateProduct
)

// Delete product by ID (requires authentication and artisan role, and verifies the user's ID)
router.delete(
  "/:product_id",
  authenticateAndCheckRole(roleArtisan),
  productController.deleteProduct
)

// Delete user image by Type
router.delete('/image/:product_id', productController.deleteUserImage);

module.exports = router
