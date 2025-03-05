// Express route handler
const express = require('express');
const {addEvenement,updateEvenement,deleteEvenement,getMesEvenements} =require ('../Controllers/evenement.controller.js');
const authenticated=require("../Middlewares/Authmiddleware.js");
const {checkEventOwnership} = require('../Middlewares/EvenementMiddleware.js');
const authorizeRoles = require('../Middlewares/RoleMiddleware.js');
const router = express.Router();

// routes crud Evenement 
router.post('/addEvenement',authenticated,addEvenement);
router.put('/updateEvenement/:id',authenticated,checkEventOwnership,updateEvenement);
router.delete('/deleteEvenement/:id',authenticated,checkEventOwnership,deleteEvenement);
router.get('/getEvenements',authenticated, authorizeRoles('Formateur','Coordinateur'),getMesEvenements);
// fin
module.exports = router;