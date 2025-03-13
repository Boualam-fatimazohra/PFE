const express = require('express');
const router = express.Router();
const { authenticateUser } = require('../middleware/auth'); // Assurez-vous d'importer votre middleware d'authentification
const { 
  getFormationStep, 
  updateFormationStep 
} = require('../Controllers/formationDraft.controller'); // Ajustez le chemin selon votre structure

// Routes pour FormationDraft
// Route pour récupérer les informations d'une FormationDraft par ID de formation
router.get('/formation-draft/:formationId', authenticateUser, getFormationStep);

// Route pour incrémenter le currentStep d'une FormationDraft
router.put('/formation-draft/:formationId', authenticateUser, updateFormationStep);

module.exports = router;