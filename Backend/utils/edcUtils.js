// utils/edcUtils.js
const Formateur = require('../Models/formateur.model');
const Manager = require('../Models/manager.model');
const { UtilisateurEntity } = require('../Models/utilisateurEntity');
const Formation = require('../Models/formation.model');
const BeneficiareFormation = require('../Models/beneficiairesFormation');
const Beneficiaire = require('../Models/beneficiaire.model');
const EDC = require('../Models/edc.model');

/**
 * Get all formateurs associated with a specific EDC
 * @param {string} edcId - The ID of the EDC entity
 * @returns {Array} - Array of formateur objects with populated fields
 */
const getAllFormateursEdc = async (edcId) => {
  try {
    // Find the EDC
    const edc = await EDC.findById(edcId).populate('entity');
    if (!edc) {
      throw new Error('EDC not found');
    }

    // Find all users associated with this EDC entity
    const utilisateurEntities = await UtilisateurEntity.find({ id_entity: edc.entity._id });
    
    // Extract user IDs
    const userIds = utilisateurEntities.map(ue => ue.id_utilisateur);
    
    // Find all formateurs whose utilisateur is in the list of user IDs
    const formateurs = await Formateur.find({ utilisateur: { $in: userIds } })
      .populate('utilisateur', 'nom prenom email numeroTelephone role')
      .populate('manager')
      .populate('coordinateur');
    
    return formateurs;
  } catch (error) {
    throw new Error(`Error fetching formateurs: ${error.message}`);
  }
};

/**
 * Get all formations created by formateurs associated with a specific EDC
 * @param {Array} formateurs - Array of formateur objects
 * @returns {Array} - Array of formation objects with populated fields
 */
const getAllFormationsEdc = async (formateurs) => {
  try {
    // Extract formateur IDs
    const formateurIds = formateurs.map(formateur => formateur._id);
    
    // Find all formations created by these formateurs
    const formations = await Formation.find({ formateur: { $in: formateurIds } })
      .populate({ 
        path: 'formateur', 
        populate: { path: 'utilisateur' } 
      });
    
    return formations;
  } catch (error) {
    throw new Error(`Error fetching formations: ${error.message}`);
  }
};

/**
 * Get all beneficiaries enrolled in formations associated with an EDC
 * @param {Array} formations - Array of formation objects
 * @returns {Array} - Array of beneficiaries with their formation details
 */
const getAllBeneficiairesFormationsEdc = async (formations) => {
  try {
    // Extract formation IDs
    const formationIds = formations.map(formation => formation._id);
    
    // Find all beneficiaire-formation relations for these formations
    const beneficiaireFormations = await BeneficiareFormation.find({ formation: { $in: formationIds } });
    
    // Extract beneficiary IDs
    const beneficiaireIds = beneficiaireFormations.map(bf => bf.beneficiaire);
    
    // Find all beneficiaries
    const beneficiaires = await Beneficiaire.find({ _id: { $in: beneficiaireIds } });
    
    // Add formation information to each beneficiary
    const beneficiairesWithFormation = await Promise.all(
      beneficiaires.map(async (beneficiaire) => {
        const beneficiaireFormation = beneficiaireFormations.find(
          bf => bf.beneficiaire.toString() === beneficiaire._id.toString()
        );
        
        if (!beneficiaireFormation) return beneficiaire._doc;
        
        const formation = formations.find(
          f => f._id.toString() === beneficiaireFormation.formation.toString()
        );
        
        if (!formation) return beneficiaire._doc;
        
        return {
          ...beneficiaire._doc,
          formationDetails: {
            id: formation._id,
            nom: formation.nom,
            dateDebut: formation.dateDebut,
            dateFin: formation.dateFin
          },
          confirmationAppel: beneficiaireFormation.confirmationAppel,
          confirmationEmail: beneficiaireFormation.confirmationEmail,
          isSubmited: beneficiaireFormation.isSubmited
        };
      })
    );
    
    return beneficiairesWithFormation;
  } catch (error) {
    throw new Error(`Error fetching beneficiaires: ${error.message}`);
  }
};

module.exports = {
  getAllFormateursEdc,
  getAllFormationsEdc,
  getAllBeneficiairesFormationsEdc
};