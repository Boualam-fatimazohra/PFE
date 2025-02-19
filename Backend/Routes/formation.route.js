const express = require('express');
const authenticated = require('../Middlewares/Authmiddleware.js');
const { createFormation, GetOneFormation, UpdateFormation, GetFormations, DeleteFormation, GetFormationOfMentor } = require('../Controllers/formation.controller.js'); // Removed duplicate DeleteFormation
const authorizeRoles = require('../Middlewares/RoleMiddleware.js');
const authorizeSelfGetUpdate = require('../Middlewares/selfAccess.js');
const upload = require('../utils/upload');
const router = express.Router();

// Route to add a new formation (Protected route: Only authenticated users can access)
router.post('/Addformation', authenticated, authorizeRoles('Formateur'),upload.single("image"),createFormation);

// Route to get all formations (No authentication required)
router.get('/GetFormations', authenticated, GetFormations);

// Route to delete a formation by ID
router.delete('/DeleteFormation/:id', authenticated, authorizeRoles('Admin', 'Manager'), DeleteFormation);

// Route to update a formation by ID 
router.put('/UpdateFormation/:id', authenticated, authorizeRoles('Admin', 'Manager'), UpdateFormation); 

// Route to get one specific formation by ID
router.get('/GetOneFormation/:id',authenticated, GetOneFormation);

router.get('/GetFormationOfMentor', authenticated, GetFormationOfMentor);

module.exports = router;
