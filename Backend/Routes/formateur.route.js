const express = require('express');
const { createFormateur, getFormateurs,updateFormateur,deleteFormateur, getFormateurById } = require('../Controllers/formateur.controller.js');
const authorizeRoles = require('../Middlewares/RoleMiddleware.js');

const router = express.Router();

router.post('/Addformateur',createFormateur);
router.get('/getFormateurs',getFormateurs);
router.put('/updateFormateur/:id',updateFormateur);
router.delete('/deleteFormateur/:id',deleteFormateur);
router.get('/getFormateurById/:id',getFormateurById);
module.exports = router;    


/*
// allowed roles example
router.get('/getFormateurById/:id', authorizeRoles('Admin', 'Manager', 'Formateur'), updateFOrmateur); 
// Everyone can see their own profile
*/

