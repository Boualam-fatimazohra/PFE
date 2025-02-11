const express = require('express');
const authenticated = require('../Middlewares/Authmiddleware.js')
const {createFormation, GetOneFormation, UpdateFormation,GetFormations,DeleteFormations,DeleteFormation,GetFormationOFmentor} = require('../Controllers/Formation.js');
const router = express.Router();


// n'oublier pas le middleware
router.post('/Addformation',authenticated,createFormation);
// n'oublier pas le middleware
router.get('/GetFormations',GetFormations);
router.delete('/DeleteFormation/:id',DeleteFormation);
router.post('/UpdateFormation/:id',UpdateFormation);
router.get('/GetOneFormation/:id',GetOneFormation);
router.put('/UpdateFormations/:id', authenticated, UpdateFormation);
router.post('/DeleteFormations', authenticated, DeleteFormations);
router.get('/GetFormationsOfMentor', authenticated, GetFormationOFmentor);

module.exports = router;