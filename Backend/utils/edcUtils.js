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
    // Vérifier si edcIds est un tableau non vide
    if (!edcIds || !Array.isArray(edcIds) || edcIds.length === 0) {
      throw new Error('La liste des EDC IDs est requise');
    }

    // Trouver tous les EDCs correspondants
    const edcs = await EDC.find({ _id: { $in: edcIds } }).populate('entity');
    if (!edcs || edcs.length === 0) {
      throw new Error('Aucun EDC trouvé');
    }

    // Extraire les IDs des entités associées aux EDCs
    const entityIds = edcs.map(edc => edc.entity._id);

    // Créer un mapping des entités pour un accès facile plus tard
    const entityMap = {};
    edcs.forEach(edc => {
      entityMap[edc.entity._id.toString()] = edc.entity;
    });

    // Trouver toutes les associations UtilisateurEntity pour ces entités
    const utilisateurEntities = await UtilisateurEntity.find({ id_entity: { $in: entityIds } });

    // Créer un mapping utilisateur -> entité
    const userToEntityMap = {};
    utilisateurEntities.forEach(ue => {
      userToEntityMap[ue.id_utilisateur.toString()] = entityMap[ue.id_entity.toString()];
    });

    // Extraire les IDs des utilisateurs
    const userIds = utilisateurEntities.map(ue => ue.id_utilisateur);

    // Trouver tous les formateurs associés à ces utilisateurs
    const formateurs = await Formateur.find({ utilisateur: { $in: userIds } })
      .populate('utilisateur', 'nom prenom email numeroTelephone role')
      .populate('manager');

    // Ajouter l'information d'entité à chaque formateur
    const formateursWithEntity = formateurs.map(formateur => {
      const formateurObj = formateur.toObject();
      const utilisateurId = formateur.utilisateur._id.toString();
      formateurObj.entity = userToEntityMap[utilisateurId] || null;
      return formateurObj;
    });

    return formateursWithEntity;
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