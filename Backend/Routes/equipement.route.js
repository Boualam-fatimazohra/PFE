const express = require('express');
const router = express.Router();
const equipementController = require('../Controllers/equipement.controller');
const authenticated = require('../Middlewares/Authmiddleware.js');
const authorizeRoles = require('../Middlewares/RoleMiddleware.js');
const { uploadProjetFabImage } = require('../Config/cloudinaryConfig.js');

    router.post('/', 
        authenticated, 
        authorizeRoles('Admin', 'Manager'), 
        uploadProjetFabImage.single('image'),
        equipementController.createEquipement
    );

    // Routes de base CRUD
    router.get('/', 
        authenticated, 
        authorizeRoles('Admin', 'Manager'), 
        equipementController.getAllEquipements
    );
    router.get('/:id', 
        authenticated, 
        authorizeRoles('Admin', 'Manager'), 
        equipementController.getEquipementById
    );
    
    router.put('/:id', 
        authenticated, 
        authorizeRoles('Admin', 'Manager'), 
        equipementController.updateEquipement
    );
    router.delete('/:id', 
        authenticated, 
        authorizeRoles('Admin', 'Manager'), 
        equipementController.deleteEquipement
    );

    router.get('/fab/:fabId', 
        authenticated, 
        authorizeRoles('Admin', 'Manager'), 
        equipementController.getEquipementsByFab
    );
    router.get('/etat/:etat', 
        authenticated, 
        authorizeRoles('Admin', 'Manager'), 
        equipementController.getEquipementsByEtat
    );

module.exports = router;