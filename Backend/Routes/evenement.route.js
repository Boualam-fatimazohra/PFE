// Express route handler
const express = require('express');
const {createEvenement,updateEvenement,deleteEvenement,getMesEvenements, getAllEvenements} =require ('../Controllers/evenement.controller.js');
const authenticated=require("../Middlewares/Authmiddleware.js");
const {checkEventOwnership} = require('../Middlewares/EvenementMiddleware.js');
const router = express.Router();

// routes crud Evenement  testés
router.post('/addEvenement',authenticated,createEvenement);
router.put('/updateEvenement/:id',authenticated,checkEventOwnership,updateEvenement);
router.delete('/deleteEvenement/:id',authenticated,checkEventOwnership,deleteEvenement);
router.get('/getMesEvenements',authenticated,getMesEvenements);
router.get('/getEvenements',authenticated,getAllEvenements);
// fin
module.exports = router;