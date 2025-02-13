const express = require('express');
const { createFormateur, getFormateurs,updateFormateur,deleteFormateur, getFormateurById } = require('../Controllers/formateur.controller.js');


const router = express.Router();


router.post('/Addformateur',createFormateur);
router.get('/getFormateurs',getFormateurs);
router.put('/updateFormateur/:id',updateFormateur);
router.delete('/deleteFormateur/:id',deleteFormateur);
router.get('/getFormateurById/:id',getFormateurById);
module.exports = router;    