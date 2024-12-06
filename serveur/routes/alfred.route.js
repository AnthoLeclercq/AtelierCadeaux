const express = require('express');
const router = express.Router();
const alfredController = require('../controllers/alfred.controller');

// Route POST pour obtenir une prédiction
router.post('/predict', alfredController.predict);

module.exports = router;
