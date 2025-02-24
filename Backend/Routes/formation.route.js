const express = require('express');
const authenticated = require('../Middlewares/Authmiddleware.js');
const { createFormation, GetOneFormation, UpdateFormation, GetFormations, DeleteFormation } = require('../Controllers/formation.controller.js'); // Removed duplicate DeleteFormation
const authorizeRoles = require('../Middlewares/RoleMiddleware.js');
const upload = require('../utils/uploadImage.js');
const authorizeNestedOwnership = require('../Middlewares/NestedOwnershipMiddleware.js')
const authorizeOwnership = require('../Middlewares/OwnershipMiddleware.js');
const authorizeFormationAccess = require('../Middlewares/FormationAccess.js');

const router = express.Router();
// Route to add a new formation (Protected route: Only authenticated users can access)
router.post('/Addformation', 
    authenticated, 
    authorizeRoles('Formateur'),
    upload.single("image"),
    createFormation
);

// Route to get all formations (No authentication required)
router.get('/GetFormations', 
    authenticated, 
    GetFormations
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
    upload.single("image"),
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

module.exports = router;