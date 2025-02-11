const express = require("express");
const router = express.Router();
const evaluationController = require("../Controllers/evaluationController");

router.post("/", evaluationController.createEvaluation); // Créer une évaluation
router.get("/:lienEvaluation", evaluationController.getEvaluationByLink); // Récupérer par lien

module.exports = router;
