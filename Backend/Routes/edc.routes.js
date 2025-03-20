const express = require('express');
const router = express.Router();
const { 
    getFormateursEdc,
    getFormationsEdc,
    getBeneficiairesEdc,
    createEDC ,
    getAllEDCs,
    getEDCById
} = require('../Controllers/edc.controller');

const authorizeRoles = require('../Middlewares/RoleMiddleware.js');
const authenticated = require('../Middlewares/Authmiddleware.js');


router.post('/',authenticated,authorizeRoles('Admin'),createEDC);
router.get('/',authenticated,authorizeRoles('Admin'), getAllEDCs);
router.get('/:id',authenticated,authorizeRoles('Admin'),getEDCById);

/*Get all  (formateurs) associated with a specific EDC */
router.get('/getFormateurEDC/:edcIds', getFormateursEdc);

/* Get all training sessions (formations) associated with a specific EDC*/
router.get('/getFormationEDC/:edcIds', getFormationsEdc);

/* Get all beneficiaries enrolled in formations associated with a specific EDC */
router.get('/getBeneficiairesEDC/:edcIds', getBeneficiairesEdc);



module.exports = router;