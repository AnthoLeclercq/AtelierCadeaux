const express = require('express');
const router = express.Router();
const productMetaController = require('../controllers/productMeta.controller.js');
const { authenticateAndCheckRole } = require('../helpers/authHelper.js');
const roleArtisan = 'artisan';

// Create new product meta (requires authentication and artisan role)
router.post('', authenticateAndCheckRole(roleArtisan), productMetaController.addProductMeta);

// Get Product ID by Meta Values because in front, can't put a body for a get method, only post
router.post("/getProductIdByMetaValues", productMetaController.getProductIdByMetaValues);

// Get product meta by product meta ID
router.get('/meta/:product_meta_id', productMetaController.getProductMetaById);

// Get all product metas by product ID
router.get('/product/:product_id', productMetaController.getProductMetasByProductId);

// Get all product metas
router.get('', productMetaController.getAllProductMetas);

// Update product meta by product meta ID (requires authentication and artisan role)
router.put('/meta/:product_meta_id', authenticateAndCheckRole(roleArtisan), productMetaController.updateProductMetaById);

// Delete product meta by product meta ID (requires authentication and admin role)
router.delete('/meta/:product_meta_id', authenticateAndCheckRole('admin'), productMetaController.deleteProductMetaById);

// Delete all product metas by product ID (requires authentication and artisan role)
router.delete('/product/:product_id', authenticateAndCheckRole(roleArtisan), productMetaController.deleteProductMetasByProductId);

module.exports = router;
