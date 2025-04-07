const Presence = require("../Models/presence.model.js");
 const mongoose = require('mongoose');
 const Formation = require("../Models/formation.model.js");
const BeneficiaireFormation = require("../Models/beneficiairesFormation.js");
const getBeneficiairesByFormation = async (formationId) => {
  const results = await BeneficiaireFormation.find({ 
    formation: new mongoose.Types.ObjectId(formationId),
    confirmationAppel: true,
    confirmationEmail: true
  })
  .populate({
    path: "beneficiaire",
    select: "-__v" // Exclure les champs inutiles
  })
  .lean() // Convertir en objet JavaScript simple
  .exec();
  
  return results;
};
 // Fonction pour récupérer les présences associées à une liste de bénéficiaires
 const getPresencesByBeneficiaires = async (beneficiairesFormationIds) => {
   return await Presence.find({ beneficiareFormation: { $in: beneficiairesFormationIds } });
 };
 
 // Fonction pour récupérer les autres formations d'un bénéficiaire
 const getOtherFormationsByBeneficiaire = async (beneficiaireId, currentFormationId) => {
   return await BeneficiaireFormation.find({ 
     beneficiaire: beneficiaireId, 
     formation: { $ne: currentFormationId } 
   }).select('formation'); // Sélectionne uniquement le champ formation
 };
 // Fonction utilitaire pour générer les jours de formation
 const genererJoursFormation = (dateDebut, dateFin) => {
  const jours = [];
  const dateActuelle = new Date(dateDebut);
  const dateFinale = new Date(dateFin);

  // Vérification des dates valides
  if (isNaN(dateActuelle) || isNaN(dateFinale)) {
    return jours;
  }
  // Boucle sur chaque jour entre dateDebut et dateFin
  while (dateActuelle <= dateFinale) {
   const jourSemaine = dateActuelle.getDay();
   console.log("Jour de la semaine", jourSemaine);
    if (jourSemaine !== 0 && jourSemaine !== 6) { // 0 = dimanche, 6 = samedi
      jours.push(new Date(dateActuelle));
    }
    dateActuelle.setDate(dateActuelle.getDate() + 1);
  }
  return jours;
};
 const creerPresencesBeneficiaires = async (formationId) => {
  try {
    // Trouver la formation pour obtenir les dates
    const formation = await Formation.findById(formationId);
    if (!formation) {
      console.log("Formation non trouvée");
      throw new Error("Formation non trouvée");
    }
    
    // Trouver tous les BeneficiareFormation associés à cette formation
    const beneficiairesFormation = await BeneficiaireFormation.find({ formation: formationId });
    
    // Résultats pour suivi
    const resultats = {
      beneficiairesConfirmes: 0,
      beneficiairesNonConfirmes: 0,
      presencesCreees: 0
    };
    
    // Vérifier chaque bénéficiaire et créer des présences si nécessaire
    for (const beneficiaire of beneficiairesFormation) {
      if (beneficiaire.confirmationAppel && beneficiaire.confirmationEmail) {
        // Calculer les jours de formation
        const joursFormation = genererJoursFormation(formation.dateDebut, formation.dateFin);
        
        // Créer une instance Presence pour chaque jour
        for (const jour of joursFormation) {
          await Presence.create({
            beneficiareFormation: beneficiaire._id,
            jour: jour,
            isPresent: false
          });
          resultats.presencesCreees++;
        }
        resultats.beneficiairesConfirmes++;
      } else {
        resultats.beneficiairesNonConfirmes++;
      }
    }
    console.log("Formation trouvée et presences creees", resultats);

    return {
      success: true,
      resultats
    };
  } catch (error) {

    console.error("Erreur lors de la création des présences:", error);
    return {
      success: false,
      error: error.message
    };
  }
};

  module.exports = {
    getBeneficiairesByFormation,
    getPresencesByBeneficiaires,
    getOtherFormationsByBeneficiaire,
    creerPresencesBeneficiaires,
    genererJoursFormation
  }