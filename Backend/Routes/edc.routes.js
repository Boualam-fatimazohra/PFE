const express = require('express');
const router = express.Router();

const { checkEntityAccess } = require('../Middlewares/EntityMiddleware.js');
const {
    getFormateursEdc,
    getFormationsEdc,
    getBeneficiairesEdc,
    createEDC,
    getAllEDCs,
    getEDCById
} = require('../Controllers/edc.controller');

const authorizeRoles = require('../Middlewares/RoleMiddleware.js');
const authenticated = require('../Middlewares/Authmiddleware.js');

// POST/GET with specific routes should come BEFORE routes with parameters
router.post('/', authenticated, authorizeRoles('Admin'), createEDC);
router.get('/', authenticated, authorizeRoles('Admin', 'Manager'), getAllEDCs);

/*Get all (formateurs) of EDCs */
router.get('/getFormateurEDC',authenticated, authorizeRoles('Manager'),checkEntityAccess('EDC'), getFormateursEdc);

/* Get all training sessions (formations) all EDC*/
router.get('/getFormationEDC',authenticated, authorizeRoles('Manager'), checkEntityAccess('EDC'), getFormationsEdc);

/* Get all beneficiaries enrolled in formations all EDC */
router.get('/getBeneficiairesEDC',checkEntityAccess('EDC'), getBeneficiairesEdc);

router.get('/:id', authenticated, authorizeRoles('Admin'), getEDCById);


module.exports = router;