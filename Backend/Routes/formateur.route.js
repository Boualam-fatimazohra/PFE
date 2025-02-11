const express = require('express');
const authenticated = require('../Middlewares/Authmiddleware.js')
const {AddFormation, GetOneFormations, UpdateFormations, GetFormations, DeleteFormations, GetFormationOFmentor} = require('../Controllers/Formation.js');
const router = express.Router();


//  en cour n'oublier pas le middleware
router.post('/Addformation',authenticated, AddFormation);

router.get('/GetFormations', authenticated, GetFormations);

router.get('/GetOneFormations/:id', GetOneFormations);

router.put('/UpdateFormations/:id', authenticated, UpdateFormations);

router.post('/DeleteFormations', authenticated, DeleteFormations);

router.get('/GetFormationsOfMentor', authenticated, GetFormationOFmentor);

module.exports = router;