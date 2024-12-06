const express = require('express');
const router = express.Router();
const resetPasswordController = require('../controllers/resetPassword.controller.js');

// Route pour demander une réinitialisation de mot de passe (envoi de l'email)
router.post('/request-reset', resetPasswordController.requestReset);

// Route pour soumettre le nouveau mot de passe
// Le token est passé en tant que paramètre de requête
router.post('/reset-password', resetPasswordController.resetPassword);

module.exports = router;