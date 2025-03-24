const BeneficiaireFormation = require("../Models/beneficiairesFormation.js");
const Presence = require("../Models/presence.model.js");
 const mongoose = require('mongoose');
 const getBeneficiairesByFormation = async (formationId) => {
   return await BeneficiaireFormation.find({ formation: new mongoose.Types.ObjectId(formationId) })
     .populate("beneficiaire") // Assure-toi que beneficiaire est bien peuplé
     .exec();
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
  module.exports = {
    getBeneficiairesByFormation,
    getPresencesByBeneficiaires,
    getOtherFormationsByBeneficiaire    
  }