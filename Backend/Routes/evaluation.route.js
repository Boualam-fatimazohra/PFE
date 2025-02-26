// Express route handler
const express = require('express');
const {SubmitEvaluation,sendEvaluationLinksToBeneficiaries} =require ('../Controllers/evaluation.controller.js');
const checkSubmission = require('../Middlewares/EvaluationMiddleware.js');
const router = express.Router();
// route pour enregistrer la réponse du beneficiare 
router.post('/submitEvaluation/:token',checkSubmission,SubmitEvaluation);
// route pour envoyer les liens de l'evaluation aux beneficiare
router.post("/sendLinkToBeneficiare",sendEvaluationLinksToBeneficiaries);

  module.exports = router;