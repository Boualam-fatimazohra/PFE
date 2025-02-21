const express = require('express');
const { createFormateur, getFormateurs, updateFormateur, deleteFormateur, getFormateurById, GetFormateurFormations } = require('../Controllers/formateur.controller.js');
const authorizeRoles = require('../Middlewares/RoleMiddleware.js');
const authenticated = require('../Middlewares/Authmiddleware.js');
const authorizeOwnership = require('../Middlewares/OwnershipMiddleware.js');

const router = express.Router();

router.post('/Addformateur', 
    authenticated, 
    authorizeRoles('Admin', 'Manager'), 
    createFormateur
);

router.get('/getFormateurs', 
    authenticated, 
    authorizeRoles('Admin', 'Manager', 'Formateur'), 
    getFormateurs
);

router.put('/updateFormateur/:id', 
    authenticated, 
    authorizeRoles('Admin', 'Manager', 'Formateur'), 
    authorizeOwnership('Formateur', "manager"),  
    updateFormateur
);

router.delete('/deleteFormateur/:id', 
    authenticated, 
    authorizeRoles('Admin', 'Manager'), 
    authorizeOwnership('Formateur', "manager"),  
    deleteFormateur
);

router.get('/getFormateurById/:id', 
    authenticated, 
    authorizeRoles('Admin', 'Manager', 'Formateur'), 
    getFormateurById
);

router.get('/getFormateurFormations/:id', 
    authenticated, 
    authorizeRoles('Admin', 'Manager', 'Formateur'),
    authorizeOwnership('Formateur', "manager"),
    GetFormateurFormations
);

module.exports = router;