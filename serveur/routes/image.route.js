const express = require('express');
const router = express.Router();
const { uploadImages, deleteImage } = require('../helpers/imageHelper');

// Route pour uploader les images
router.post('/upload', uploadImages);

// Route pour supprimer une image
router.delete('/delete/:filename', deleteImage);

module.exports = router;

