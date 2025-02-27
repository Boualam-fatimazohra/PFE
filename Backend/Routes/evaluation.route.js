// Express route handler
const express = require('express');
const {SubmitEvaluation,sendEvaluationLinksToBeneficiaries,tauxSatisfactionParFormation,tauxSatisfactionParFormateur} =require ('../Controllers/evaluation.controller.js');
const checkSubmission = require('../Middlewares/EvaluationMiddleware.js');
const authenticated=require('../Middlewares/Authmiddleware.js');
const router = express.Router();
// route pour enregistrer la réponse du beneficiare 

router.post('/submitEvaluation/:token',checkSubmission,SubmitEvaluation);
// route pour envoyer les liens de l'evaluation aux beneficiare
//todo : il faut ajouter le  middleware authenticated
router.post("/sendLinkToBeneficiare",sendEvaluationLinksToBeneficiaries);
// retourne le taux de satisfaction par formation
router.get("/tauxSatisfactionParFormation/:id",tauxSatisfactionParFormation);
// retourn le taux de satisfaction par formateur
router.get("/tauxSatisfactionParFormateur",authenticated,tauxSatisfactionParFormateur);
module.exports = router;