const { hashBeneficiaire } = require("../utils/hashBenef");
const Beneficiaire = require("../Models/beneficiaire.model");
/**
 * Récupère tous les bénéficiaires existants et stocke leurs hash pour vérification rapide
 * @returns {Set} Ensemble des hash des bénéficiaires
 */
const getExistingBeneficiairesHashes = async () => {
  const beneficiaires = await Beneficiaire.find({}, "email nom prenom").lean();
  return new Set(beneficiaires.map(b => hashBeneficiaire(b.email, b.nom, b.prenom)));
};

/**
 * Vérifie si un bénéficiaire est déjà stocké
 * @param {Object} beneficiaire 
 * @param {Set} existingHashes 
 * @returns {boolean} true si déjà existant, false sinon
 */
const isDuplicateBeneficiaire = (beneficiaire, existingHashes) => {
  const hash = hashBeneficiaire(beneficiaire.email, beneficiaire.nom, beneficiaire.prenom);
  return existingHashes.has(hash);
};
module.exports = { getExistingBeneficiairesHashes, isDuplicateBeneficiaire };