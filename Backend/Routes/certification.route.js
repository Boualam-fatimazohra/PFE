const express = require('express');
const authenticated = require('../Middlewares/Authmiddleware.js');
const { genererEtTelechargerCertificats} = require('../Controllers/certification.controller.js');
const authorizeRoles = require('../Middlewares/RoleMiddleware.js');

const router = express.Router();
// Route pour télécharger un fichier zip qui contient les pdf des certification 
router.post('/TelechargerCertificats', 
    // authenticated, 
    // authorizeRoles('Formateur'),
    genererEtTelechargerCertificats
);
module.exports = router;