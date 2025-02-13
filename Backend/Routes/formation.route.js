const express = require('express');
const authenticated = require('../Middlewares/Authmiddleware.js');
const { createFormation, GetOneFormation, UpdateFormation, GetFormations, DeleteFormation, GetFormationOfMentor } = require('../Controllers/formation.controller.js'); // Removed duplicate DeleteFormation
const router = express.Router();

// Route to add a new formation (Protected route: Only authenticated users can access)
router.post('/Addformation', authenticated, createFormation);

// Route to get all formations (No authentication required)
router.get('/GetFormations', GetFormations);

// Route to delete a formation by ID
router.delete('/DeleteFormation/:id', authenticated, DeleteFormation);

// Route to update a formation by ID (Method changed from POST to PUT for consistency)
router.put('/UpdateFormation/:id', authenticated, UpdateFormation); // Changed method from POST to PUT for best practice

// Route to get one specific formation by ID
router.get('/GetOneFormation/:id', GetOneFormation);

// Removed redundant '/UpdateFormations/:id' route, as it was a duplicate of '/UpdateFormation/:id'

// Removed commented-out route for '/DeleteFormations', as there was no DeleteFormations function

// Route to get formations of a specific mentor (Protected route)
router.get('/GetFormationOfMentor', authenticated, GetFormationOfMentor);

module.exports = router;
