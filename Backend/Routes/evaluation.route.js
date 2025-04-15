// Express route handler
const express = require('express');
const {SubmitEvaluation,sendEvaluationLinksToBeneficiaries ,createEvaluation ,getAllEvaluations,deleteEvaluation,getEvaluationFormateur} =require ('../Controllers/evaluation.controller.js');
const checkSubmission = require('../Middlewares/EvaluationMiddleware.js');
const authorizeRoles = require('../Middlewares/RoleMiddleware.js');
const authenticated = require('../Middlewares/Authmiddleware.js');
const authorizeOwnership = require('../Middlewares/OwnershipMiddleware.js');
const router = express.Router();
// route pour enregistrer la réponse du beneficiare 
router.post('/submitEvaluation/:token',checkSubmission,SubmitEvaluation);
// route pour envoyer les liens de l'evaluation aux beneficiare
router.post('/sendLinkToBeneficiare',sendEvaluationLinksToBeneficiaries);
router.get('/getEvaluationFormateur', 
    authenticated, 
    authorizeRoles('Formateur'),
    getEvaluationFormateur
);

// route pour récupérer toutes les évaluations
router.get('/AllEvaluation', getAllEvaluations);
router.get('/deletEvaluation/:id',deleteEvaluation);

router.post("/CreatEvaluation",
    authenticated, 
    authorizeRoles('Formateur'),
    createEvaluation);
  module.exports = router;