const express = require('express');
const router = express.Router();
const authenticated = require('../Middlewares/Authmiddleware.js');
const authorizeRoles = require('../Middlewares/RoleMiddleware.js');
const projetFabController = require('../Controllers/projetFab.controller');
const { uploadProjetFabImage } = require('../Config/cloudinaryConfig.js');


// Route pour créer un nouveau projet
router.post('/',
    authenticated, 
    authorizeRoles('Admin', 'Manager'), 
    uploadProjetFabImage.single('image'),
    projetFabController.create
);

// Route pour récupérer tous les projets
router.get('/',
    authenticated, 
    authorizeRoles('Admin', 'Manager'), 
    projetFabController.getAll
);

// Route pour récupérer un projet par son ID
router.get('/:id',
    authenticated, 
    authorizeRoles('Admin', 'Manager'), 
    projetFabController.getById
);

// Route pour mettre à jour un projet
router.put('/:id',
    authenticated, 
    authorizeRoles('Admin', 'Manager'), 
    projetFabController.update
);

// Route pour supprimer un projet
router.delete('/:id',
    authenticated, 
    authorizeRoles('Admin', 'Manager'),
    projetFabController.delete
);

// Route pour récupérer les projets par statut
router.get('/status/:status',
    authenticated, 
    authorizeRoles('Admin', 'Manager'), 
    projetFabController.getByStatus
);

// Route pour mettre à jour le statut d'un projet
router.patch('/:id/status',
    authenticated, 
    authorizeRoles('Admin', 'Manager'), 
    projetFabController.updateStatus
);

// Route pour mettre à jour la progression d'un projet
router.patch('/:id/progress',
    authenticated, 
    authorizeRoles('Admin', 'Manager'), 
    projetFabController.updateProgress
);

module.exports = router;