const express = require('express');
const { createFormateur, getFormateurs,updateFormateur,deleteFormateur, getFormateurById } = require('../Controllers/formateur.controller.js');
const authorizeRoles = require('../Middlewares/RoleMiddleware.js');
const authenticated = require('../Middlewares/Authmiddleware.js');
const authorizeSelfGetUpdate = require('../Middlewares/selfAccess.js');
const authorizeOwnership = require('../Middlewares/OwnershipMiddleware.js');
const Formateur = require('../Models/formateur.model.js');

const router = express.Router();

router.post('/Addformateur',authenticated, authorizeRoles('Admin', 'Manager'), createFormateur);
router.get('/getFormateurs',authenticated, authorizeRoles('Admin', 'Manager', 'Formateur'), getFormateurs);
router.put('/updateFormateur/:id',authenticated, authorizeRoles('Admin', 'Manager', 'Formateur'), authorizeOwnership(Formateur, "manager"), updateFormateur);
router.delete('/deleteFormateur/:id',authenticated, authorizeRoles('Admin', 'Manager'), authorizeOwnership(Formateur, "manager"), deleteFormateur);
router.get('/getFormateurById/:id',authenticated,authorizeRoles('Admin', 'Manager', 'Formateur'), authorizeOwnership(Formateur, "manager"), getFormateurById);

module.exports = router;