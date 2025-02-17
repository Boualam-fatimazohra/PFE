const mongoose = require("mongoose");
const Evaluation = require("../Models/evaluation.model.js");

exports.createEvaluation = async (req, res) => {
    try {
      const evaluationData = {
        contentEvaluation: {
          qualiteContenuFormation: req.body.contentEvaluation?.qualiteContenuFormation,
          utiliteCompetencesAcquises: req.body.contentEvaluation?.utiliteCompetencesAcquises,
          alignementBesoinsProf: req.body.contentEvaluation?.alignementBesoinsProf,
          structureFormation: req.body.contentEvaluation?.structureFormation,
          niveauDifficulte: req.body.contentEvaluation?.niveauDifficulte
        },
        pedagogy: {
          qualitePedagogique: req.body.pedagogy?.qualitePedagogique,
          expertiseFormateur: req.body.pedagogy?.expertiseFormateur,
          qualiteSupportFormation: req.body.pedagogy?.qualiteSupportFormation,
          qualiteExercices: req.body.pedagogy?.qualiteExercices,
          adaptationNiveauParticipants: req.body.pedagogy?.adaptationNiveauParticipants
        },
        materialConditions: {
          confortSalle: req.body.materialConditions?.confortSalle,
          accessibiliteLieu: req.body.materialConditions?.accessibiliteLieu,
          horaires: req.body.materialConditions?.horaires,
          materielPedagogique: req.body.materialConditions?.materielPedagogique
        },
        generalOrganization: {
          communicationOrganisationnelle: req.body.generalOrganization?.communicationOrganisationnelle
        },
        recommandation:req.body.recommandation,
        commentaire: req.body?.commentaire
      };
  
      const evaluation = new Evaluation(evaluationData);
      await evaluation.save();
  
      res.status(201).json({
        message: 'Evaluation submitted successfully',
        evaluation: evaluation
      });
    } catch (error) {
      res.status(500).json({
        message: 'Error submitting evaluation',
        error: error.message
      });
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
exports.getLastEvaluation = async (req, res) => {
    console.log("debut de la fonction getLastEvaluation");
    try {
    const evaluation = await Evaluation.findOne();
    console.log("evaluation ::: ", evaluation); // Affiche l'évaluation dans la console
    if (!evaluation) {
        console.log("Aucune évaluation trouvée.");
        return res.status(404).json({ error: "Évaluation non trouvée" });
      }
    res.status(200).json(evaluation);
    } catch (error) {
      console.log("Erreur:", error);
      res.status(500).json({ error: "Erreur lors de la récupération de l'évaluation" });
    }
  };
  
  
  

  
