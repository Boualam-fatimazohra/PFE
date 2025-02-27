const Evaluation = require("../Models/evaluation.model.js");
const Formation=require("../Models/formation.model.js");
const mongoose = require('mongoose');
const calculerTauxSatisfaction = async (idFormation) => {
  try {
    // Vérifier si l'ID de formation est valide
    if (!idFormation || !mongoose.Types.ObjectId.isValid(idFormation)) {
      throw new Error("ID de formation invalide");
    }

    // Récupérer toutes les évaluations pour cette formation
    const evaluations = await Evaluation.find({ formation: idFormation });
    
    // Initialiser les compteurs
    let nombreOui = 0;
    const nombreTotal = evaluations.length;
    
    // Compter les recommandations positives
    for (const evaluation of evaluations) {
      if (evaluation && evaluation.recommandation === "Oui") {
        nombreOui++;
      }
    }
    
    // Calculer le pourcentage de satisfaction
    const tauxPourcentage = nombreTotal > 0 ? (nombreOui / nombreTotal) * 100 : 0;
    
    // Récupérer les informations de la formation pour plus de contexte
    const formation = await Formation.findById(idFormation);
    const formationTitle = formation ? formation.title : "Titre non disponible";
    
    // Retourner les statistiques
    return {
      formationId: idFormation,
      formationTitle,
      taux: parseFloat(tauxPourcentage.toFixed(2)),
      nombreOui,
      nombreTotal
    };
  } catch (error) {
    throw new Error(`Erreur lors du calcul du taux de satisfaction: ${error.message}`);
  }
};
module.exports={calculerTauxSatisfaction}