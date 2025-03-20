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

    // Trouver toutes les associations UtilisateurEntity pour ces entités
    const utilisateurEntities = await UtilisateurEntity.find({ id_entity: { $in: entityIds } });

    // Extraire les IDs des utilisateurs
    const userIds = utilisateurEntities.map(ue => ue.id_utilisateur);

    // Trouver tous les formateurs associés à ces utilisateurs
    const formateurs = await Formateur.find({ utilisateur: { $in: userIds } })
        .populate('utilisateur', 'nom prenom email numeroTelephone role')
        .populate('manager');

    return formateurs;
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

    // Trouver toutes les formations créées par ces formateurs
    const formations = await Formation.find({ formateur: { $in: formateurIds } })
      .populate({ 
        path: 'formateur', 
        populate: { path: 'utilisateur' } 
      });

    return formations;
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