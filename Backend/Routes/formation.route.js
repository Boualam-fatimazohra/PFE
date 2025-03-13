const express = require('express');
const authenticated = require('../Middlewares/Authmiddleware.js');
const { 
    createFormation, 
    GetOneFormation, 
    UpdateFormation, 
    getAllFormations, 
    DeleteFormation,
    getFormations
} = require('../Controllers/formation.controller.js');
const authorizeRoles = require('../Middlewares/RoleMiddleware.js');
const { uploadImage } = require('../Config/cloudinaryConfig.js');
const authorizeFormationAccess = require('../Middlewares/FormationAccess.js');
const { 
  getFormationStep, 
  updateFormationStep ,
  createFormationDraft,
  getAllFormationsWithDraftStatus
} = require('../Controllers/formationDraft.controller'); // Ajustez le chemin selon votre structure

const router = express.Router();
// Route to add a new formation (Protected route: Only authenticated users can access)
router.post('/Addformation', 
    authenticated, 
    authorizeRoles('Formateur'),
    uploadImage.single("image"),
    createFormation
);
router.post('/createFormationDraft',
    authenticated,
    authorizeRoles('Formateur'),
    uploadImage.single("image"),
    createFormationDraft);

// Route to get all formations d'un formateur soit ce qui sont draft ou non
router.get('/getAllFormationsWithDraft', 
    authenticated, 
    authorizeRoles('Formateur'),
    getAllFormationsWithDraftStatus
);
router.get('/getAllFormations', 
    authenticated,
    authorizeRoles('Manager'),
    uploadImage.single("image"),
    getAllFormations
);


// Route to delete a formation by ID
router.delete('/DeleteFormation/:id', 
    authenticated, 
    authorizeRoles('Admin', 'Manager'),
    authorizeFormationAccess('delete'),
    DeleteFormation
);

// Route to update a formation by ID 
router.put('/UpdateFormation/:id', 
    authenticated, 
    authorizeRoles('Admin', 'Manager', 'Formateur'),
    uploadImage.single("image"),
    authorizeFormationAccess('update'),
    UpdateFormation
); 

// Route to get one specific formation by ID
router.get('/GetOneFormation/:id',
    authenticated,
    authorizeRoles('Admin', 'Manager', 'Formateur'),  
    authorizeFormationAccess('read'),
    GetOneFormation
);

// Route to get all formations of a specific formateur
router.get('/getFormations', 
    authenticated, 
    authorizeRoles('Formateur'),
    getFormations
);
router.get('/formation-draft/:formationId', authenticated, getFormationStep);

// Route pour incrémenter le currentStep d'une FormationDraft
router.put('/formation-draft/:formationId', authenticated, updateFormationStep);
module.exports = router;