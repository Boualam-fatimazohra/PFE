const crypto = require("crypto");

/**
 * Hash les informations critiques du bénéficiaire pour comparaison
 * @param {string|null} email
 * @param {string|null} nom
 * @param {string|null} prenom
 * @returns {string} Hash SHA-256
 */
const hashBeneficiaire = (email, nom, prenom) => {
  const safeEmail = email ? email.toLowerCase() : "";
  const safeNom = nom ? nom.toLowerCase() : "";
  const safePrenom = prenom ? prenom.toLowerCase() : "";

  const data = `${safeEmail}|${safeNom}|${safePrenom}`;
  return crypto.createHash("sha256").update(data).digest("hex");
};

module.exports = { hashBeneficiaire };
