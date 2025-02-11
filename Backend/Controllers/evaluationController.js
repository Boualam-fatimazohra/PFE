const mongoose = require("mongoose");
const Evaluation = require("../Models/evaluation.model");

// 🎯 Créer une évaluation
exports.createEvaluation = async (req, res) => {
  try {
    const { tauxSatisfaction, questions, formation } = req.body;

    if (!mongoose.Types.ObjectId.isValid(formation)) {
      return res.status(400).json({ error: "ID de formation invalide" });
    }

    const lienEvaluation = `${req.protocol}://${req.get("host")}/evaluation/${Math.random().toString(36).substring(7)}`;

    const newEvaluation = await Evaluation.create({
      tauxSatisfaction,
      lienEvaluation,
      questions: JSON.stringify(questions),
      formation: new mongoose.Types.ObjectId(formation), // ✅ Correction ici
    });

    res.status(201).json({ message: "Évaluation créée avec succès", evaluation: newEvaluation });
  } catch (error) {
    console.log("Erreur:", error);
    res.status(500).json({ error: "Erreur lors de la création de l'évaluation" });
  }
};
exports.getEvaluationByLink = async (req, res) => {
    try {
      const { lienEvaluation } = req.params;
      const evaluation = await Evaluation.findOne({ lienEvaluation });
  
      if (!evaluation) {
        return res.status(404).json({ error: "Évaluation non trouvée" });
      }
  
      res.status(200).json(evaluation);
    } catch (error) {
      console.log("Erreur:", error);
      res.status(500).json({ error: "Erreur lors de la récupération de l'évaluation" });
    }
  };
  
