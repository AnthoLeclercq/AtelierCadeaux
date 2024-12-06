const express = require("express");
const router = express.Router();
const metaController = require("../controllers/meta.controller");

// Route to get all metas except subcategories
router.get("/all-except-subcategories", metaController.getAllMetasExceptSubcategories);

// Route to get subcategories by category
router.get("/subcategories-by-category/:category", metaController.getSubcategoriesByCategory);

module.exports = router;