const express = require('express');
const authenticated = require('../Middlewares/Authmiddleware')
const {AddFormation, GetOneFormations, UpdateFormations, GetFormations, DeleteFormations, GetFormationOFmentor} = require('../Controllers/Formation');
const router = express.Router();



router.post('/Addformation', authenticated, AddFormation);

router.get('/GetFormations', authenticated, GetFormations);

router.get('/GetOneFormations/:id', GetOneFormations);

router.put('/UpdateFormations/:id', authenticated, UpdateFormations);

router.post('/DeleteFormations', authenticated, DeleteFormations);

router.get('/GetFormationsOfMentor', authenticated, GetFormationOFmentor);

module.exports = router;