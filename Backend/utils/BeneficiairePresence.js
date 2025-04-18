const Presence = require("../Models/presence.model.js");
 const mongoose = require('mongoose');
 const Formation = require("../Models/formation.model.js");
const BeneficiaireFormation = require("../Models/beneficiairesFormation.js");

// Fonction pour récupérer les bénéficiaires d'une formation
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
// Fonction utilitaire pour générer les jours de formation
const genererJoursFormation = (dateDebut, dateFin) => {
  const jours = [];
  
  // Convert dates to YYYY-MM-DD strings for consistent day-based comparison
  const formatYMD = (date) => new Date(date).toISOString().split('T')[0];
  
  // Get the date ranges as strings
  const startDate = formatYMD(dateDebut);
  const endDate = formatYMD(dateFin);
  
  // Create date objects for iteration
  const dateActuelle = new Date(startDate);
  const dateFinale = new Date(endDate);
  dateFinale.setDate(dateFinale.getDate() + 1); // Add one day to include end date
  
  console.log(`Generating days from ${startDate} to ${endDate}`);
  
  // Loop through each day
  while (formatYMD(dateActuelle) < formatYMD(dateFinale)) {
    // Store the date as an ISO string date (YYYY-MM-DD)
    jours.push(formatYMD(dateActuelle));
    
    // Move to next day
    dateActuelle.setDate(dateActuelle.getDate() + 1);
  }
  
  console.log(`Generated ${jours.length} days between ${startDate} and ${endDate}`);
  return jours;
};

const creerPresencesBeneficiaires = async (formationId) => {
  try {
    // Find the formation
    const formation = await Formation.findById(formationId);
    if (!formation) {
      console.log("Formation not found");
      throw new Error("Formation not found");
    }
    
    // Find all beneficiaries for this formation
    const beneficiairesFormation = await BeneficiaireFormation.find({ formation: formationId });
    
    // Track results
    const resultats = {
      beneficiairesConfirmes: 0,
      beneficiairesNonConfirmes: 0,
      presencesCreees: 0
    };
    
    // Process each beneficiary
    for (const beneficiaire of beneficiairesFormation) {
      if (beneficiaire.confirmationAppel && beneficiaire.confirmationEmail) {
        // Generate the training days as YYYY-MM-DD strings
        const joursFormation = genererJoursFormation(formation.dateDebut, formation.dateFin);
        
        // Create a presence record for each day
        for (const jourStr of joursFormation) {
          await Presence.create({
            beneficiareFormation: beneficiaire._id,
            jour: jourStr, // Store as YYYY-MM-DD string directly
            isPresent: false
          });
          resultats.presencesCreees++;
        }
        resultats.beneficiairesConfirmes++;
      } else {
        resultats.beneficiairesNonConfirmes++;
      }
    }
    
    console.log("Formation found and presences created:", resultats);
    
    return {
      success: true,
      resultats
    };
  } catch (error) {
    console.error("Error creating presences:", error);
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