const express = require("express");
const router = express.Router();
const evaluationController = require("../Controllers/evaluation.controller");

router.post("/", evaluationController.createEvaluation); 
router.get("/:lienEvaluation", evaluationController.getEvaluationByLink); 
router.get("/lastEvaluation", evaluationController.getLastEvaluation); 
module.exports = router;
