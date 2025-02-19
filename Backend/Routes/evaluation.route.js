// Express route handler
const express = require('express');
const {SubmitEvaluation,sendEvaluationLinksToBeneficiaries} =require ('../Controllers/evaluation.controller.js');
const checkSubmission = require('../Middlewares/EvaluationMiddleware.js');
const router = express.Router();
// todo : il faut ajouter le middleware qui verifier  est ce que le token qui est dans param n'est pas déja envoyer
router.post('/submitEvaluation/:token',checkSubmission,SubmitEvaluation);
router.post("/sendLinkToBeneficiare",sendEvaluationLinksToBeneficiaries);

  module.exports = router;