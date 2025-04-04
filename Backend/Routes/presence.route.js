const express = require('express');
const authenticated = require('../Middlewares/Authmiddleware.js');
const { 
  MarquerPresence
} = require('../Controllers/presence.controller.js');
const authorizeRoles = require('../Middlewares/RoleMiddleware.js');
const authorizeFormationAccess = require('../Middlewares/FormationAccess.js');

const router = express.Router();

router.post('/enregistrerPresence', 
    authenticated, 
    authorizeRoles('Formateur'),
    authorizeFormationAccess('presence'), //TODO: --> add presence access logic in the middleware
    MarquerPresence
);


module.exports = router;