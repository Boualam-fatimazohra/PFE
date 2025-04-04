const express = require('express');
const router = express.Router();
const TotalUtilisateursController = require('../Controllers/user.controller');

// Route pour obtenir le total des utilisateurs
// router.get('/total', TotalUtilisateursController.getTotalUtilisateurs);

// Route pour obtenir le total avec détails
router.get('/total-details', TotalUtilisateursController.getTotalUtilisateursAvecDetails);

// Route pour obtenir un utilisateur par ID
// router.get('/utilisateur/:id', TotalUtilisateursController.getUtilisateurById);

module.exports = router;