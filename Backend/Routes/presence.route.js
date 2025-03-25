const express = require('express');
const authenticated = require('../Middlewares/Authmiddleware.js');
const { 
  MarquerPresence
} = require('../Controllers/presence.controller.js');
const authorizeRoles = require('../Middlewares/RoleMiddleware.js');
 // Ajustez le chemin selon votre structure

const router = express.Router();
// Route to add a new formation (Protected route: Only authenticated users can access)
router.post('/enregistrerPresence', 
    authenticated, 
    authorizeRoles('Formateur'),
    MarquerPresence
);


module.exports = router;