const express = require('express');
const router = express.Router();
const searchController = require('../controllers/elasticsearch.controller');

// Route pour rechercher dans tous les indices
router.get('/search', searchController.searchAll);

module.exports = router;