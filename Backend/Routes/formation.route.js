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
const { upload } = require('../Config/cloudinaryConfig.js');
const authorizeFormationAccess = require('../Middlewares/FormationAccess.js');

const router = express.Router();

// Route to add a new formation
router.post('/Addformation', 
    authenticated, 
    authorizeRoles('Formateur'),
    upload.single("image"),
    createFormation
);

// Route to get all formations
router.get('/getAllFormations', 
    authenticated, 
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


module.exports = router;