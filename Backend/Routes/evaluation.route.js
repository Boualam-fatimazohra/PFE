// Express route handler
const express = require('express');
import {createEvaluation} from '../Controllers/evaluation.controller.js';
const router = express.Router();
// router.post('/createEvaluation',createEvaluation);

// router.get("/:lienEvaluation",getEvaluationByLink); 
// router.get("/lastEvaluation", getLastEvaluation);
router.post("/importResponse", upload.single("file"), async (req, res) => {
  if (!req.file) {
      return res.status(400).json({ message: "Aucun fichier fourni" });
  }
  try {
      await importEvaluationsFromExcel(req.file.path);
      res.status(200).json({ message: "Importation réussie !" });
  } catch (error) {
      res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
});
  module.exports = router;