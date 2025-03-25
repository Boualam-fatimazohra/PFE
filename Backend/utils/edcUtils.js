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
const getAllFormateursEdc = async (edcIds) => {
  try {
    // Existing code to get formateurs with entities
    if (!edcIds || !Array.isArray(edcIds) || edcIds.length === 0) {
      throw new Error('La liste des EDC IDs est requise');
    }
    
    const edcs = await EDC.find({ _id: { $in: edcIds } }).populate('entity');
    if (!edcs || edcs.length === 0) {
      throw new Error('Aucun EDC trouvé');
    }
    
    const entityIds = edcs.map(edc => edc.entity._id);
    
    const entityMap = {};
    edcs.forEach(edc => {
      entityMap[edc.entity._id.toString()] = edc.entity;
    });
    
    const utilisateurEntities = await UtilisateurEntity.find({ id_entity: { $in: entityIds } });
    
    const userToEntityMap = {};
    utilisateurEntities.forEach(ue => {
      userToEntityMap[ue.id_utilisateur.toString()] = entityMap[ue.id_entity.toString()];
    });
    
    const userIds = utilisateurEntities.map(ue => ue.id_utilisateur);
    
    const formateurs = await Formateur.find({ utilisateur: { $in: userIds } })
      .populate('utilisateur', 'nom prenom email numeroTelephone role')
      .populate('manager');
    
    // Get all formateur IDs for fetching formations
    const formateurIds = formateurs.map(formateur => formateur._id);
    
    // Fetch all current formations for these formateurs
    const currentDate = new Date();
    const formations = await Formation.find({
      formateur: { $in: formateurIds },
      dateDebut: { $lte: currentDate },
      dateFin: { $gte: currentDate }
    });
    
    // Create a mapping of formateur IDs to their active formations
    const formateurToFormationsMap = {};
    formations.forEach(formation => {
      const formateurId = formation.formateur.toString();
      if (!formateurToFormationsMap[formateurId]) {
        formateurToFormationsMap[formateurId] = [];
      }
      formateurToFormationsMap[formateurId].push(formation);
    });
    
    // Add entity and availability information to each formateur
    const formateursWithEntityAndAvailability = formateurs.map(formateur => {
      const formateurObj = formateur.toObject();
      const utilisateurId = formateur.utilisateur._id.toString();
      const formateurId = formateur._id.toString();
      
      // Add entity information
      formateurObj.entity = userToEntityMap[utilisateurId] || null;
      
      // Add active formations
      const activeFormations = formateurToFormationsMap[formateurId] || [];
      formateurObj.hasActiveFormations = activeFormations.length > 0;
      formateurObj.activeFormationsCount = activeFormations.length;
      
      // Determine availability based on active formations
      // You can customize this logic based on your business rules
      formateurObj.isAvailable = activeFormations.length < 2; // For example, a formateur is available if they have less than 2 active formations
      
      return formateurObj;
    });
    
    return formateursWithEntityAndAvailability;
  } catch (error) {
    throw new Error(`Erreur lors de la récupération des formateurs: ${error.message}`);
  }
};

/**
 * Get all formations created by formateurs associated with a specific EDC
 * @param {Array} formateurs - Array of formateur objects
 * @returns {Array} - Array of formation objects with populated fields
 */
const getAllFormationsEdc = async (formateurs) => {
  try {
    // Extraire les IDs des formateurs
    const formateurIds = formateurs.map(formateur => formateur._id);
    
    // Extraire les IDs des utilisateurs liés aux formateurs
    const utilisateurIds = formateurs.map(formateur => formateur.utilisateur);
    
    // Récupérer les relations utilisateur-entity
    const utilisateurEntities = await UtilisateurEntity.find({
      id_utilisateur: { $in: utilisateurIds }
    }).populate('id_entity');
    
    // Créer un mapping des utilisateurs vers leurs entités
    const utilisateurToEntityMap = {};
    utilisateurEntities.forEach(ue => {
      utilisateurToEntityMap[ue.id_utilisateur.toString()] = ue.id_entity;
    });
    
    // Trouver toutes les formations créées par ces formateurs
    const formations = await Formation.find({ formateur: { $in: formateurIds } })
      .populate({
        path: 'formateur',
        populate: { 
          path: 'utilisateur'
        }
      });
    
    // Ajouter manuellement les informations d'entité à chaque formation
    const formationsWithEntity = formations.map(formation => {
      const formationObj = formation.toObject();
      const utilisateurId = formation.formateur.utilisateur._id.toString();
      formationObj.entity = utilisateurToEntityMap[utilisateurId] || null;
      return formationObj;
    });
    
    return formationsWithEntity;
  } catch (error) {
    throw new Error(`Erreur lors de la récupération des formations: ${error.message}`);
  }
};

/**
 * Get all beneficiaries enrolled in formations associated with an EDC
 * @param {Array} formations - Array of formation objects
 * @returns {Array} - Array of beneficiaries with their formation details
 */
const getAllBeneficiairesFormationsEdc = async (formations) => {
  try {
    // Extraire les IDs des formations
    const formationIds = formations.map(formation => formation._id);

    // Trouver toutes les relations bénéficiaire-formation pour ces formations
    const beneficiaireFormations = await BeneficiareFormation.find({ formation: { $in: formationIds } });

    // Extraire les IDs des bénéficiaires
    const beneficiaireIds = beneficiaireFormations.map(bf => bf.beneficiaire);

    // Trouver tous les bénéficiaires
    const beneficiaires = await Beneficiaire.find({ _id: { $in: beneficiaireIds } });

    // Ajouter les informations de formation à chaque bénéficiaire
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
    throw new Error(`Erreur lors de la récupération des bénéficiaires: ${error.message}`);
  }
};

module.exports = {
  getAllFormateursEdc,
  getAllFormationsEdc,
  getAllBeneficiairesFormationsEdc
};