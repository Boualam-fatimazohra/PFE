const express = require('express');
const authenticated=require("../Middlewares/Authmiddleware.js");
const authorizeRoles = require('../Middlewares/RoleMiddleware.js');
const {createAchat,getAllAchats,getAchatById,deleteAchat,getAchatsByType} = require('../Controllers/achat.controller.js');

const router = express.Router();
// les routes fonctionnelles jusqu'a present 
router.post('/createAchat',authenticated,authorizeRoles("Coordinateur"),createAchat);
router.get('/getAllAchatsCoordinateur',authenticated,authorizeRoles("Coordinateur"),getAllAchats);
router.get('/getAchatById/:id', authenticated,authorizeRoles("Coordinateur"),getAchatById);
//router.put('/updateAchat',authenticated,authorizeRoles("Coordinateur"),updateAchat);
router.delete('/deleteAchat/:id',authenticated,authorizeRoles("Coordinateur"),deleteAchat);
router.get('/getAchatsByType/:associationType',authenticated,authorizeRoles("Coordinateur"),getAchatsByType);


module.exports = router;