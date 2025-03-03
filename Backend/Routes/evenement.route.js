// Express route handler
const express = require('express');
const {addEvenement,updateEvenement,deleteEvenement} =require ('../Controllers/evenement.controller.js');
const authenticated=require("../Middlewares/Authmiddleware.js");
const router = express.Router();

// routes crud Evenement 
router.post('/addEvenement',authenticated,addEvenement);
router.put('/updateEvenement/:id',authenticated,updateEvenement);
router.delete('/deleteEvenement/:id',authenticated,deleteEvenement);
module.exports = router;