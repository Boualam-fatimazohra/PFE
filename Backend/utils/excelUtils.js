const XLSX = require("xlsx");

/**
 * Transforme le fichier Excel en tableau d'objets structurés
 * @param {Buffer} fileBuffer 
 * @returns {Array} Liste des bénéficiaires extraits du fichier
 */
 const parseExcelFile = (fileBuffer) => {
  const workbook = XLSX.read(fileBuffer, { type: "buffer" });

  if (!workbook.SheetNames.length) {
    throw new Error("No sheets found in the uploaded Excel file");
  }

  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];

  if (!worksheet) {
    throw new Error("First sheet is empty or not found");
  }

  const rawData = XLSX.utils.sheet_to_json(worksheet);

  return rawData.map(item => ({
    horodateur: item["Horodateur"] || null,
    email: item["Email"] || null,
    prenom: typeof item["Prénom"] === "string" ? item["Prénom"].trim() : null,
    nom: typeof item["Nom"] === "string" ? item["Nom"].trim() : null,
    genre: item["Genre"] || null,
    dateDeNaissance: item["Date de naissance"]
      ? new Date((item["Date de naissance"] - 25569) * 86400000)
      : null,
    pays: typeof item["Pays"] === "string" ? item["Pays"].trim() : null,
    situationProfessionnelle: item["Situation Profetionnelle"] || null,
    profession: typeof item["Profession"] === "string" ? item["Profession"].trim() : null,
    age: item["Votre age"] || null,
    telephone: item["Télélphone"] || null,
    niveauEtudes: item["Niveau d'etudes"] || null,
    experienceGestionProjet: item["Avez vous une expérience avec la gestion de projet."] || null,
    specialite: typeof item["Votre spécialité"] === "string" ? item["Votre spécialité"].trim() : null,
    etablissement: typeof item["Établissement"] === "string" ? item["Établissement"].trim() : null,
    dejaParticipeODC: item["Avez-vous déja participé au programmes ODC"] || null,
  }));
};

module.exports = { parseExcelFile };
