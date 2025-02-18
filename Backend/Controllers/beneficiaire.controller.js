const Beneficiaire = require("../Models/beneficiaire.model");
const Formation = require("../Models/formation.model");
const readExcelFile = require("../utils/excelReader");
const XLSX = require("xlsx");

// Create a new Beneficiaire
const createBeneficiaire = async (req, res) => {
  try {
    const { nom, prenom, dateNaissance, niveau, formationId, isBlack, isSuturate } = req.body;
    if (!formationId) {
      return res.status(400).json({ message: "A formationId is required" });
    }
    const formationExists = await Formation.findById(formationId);
    if (!formationExists) {
      return res.status(404).json({ message: "Formation not found" });
    }
    const beneficiaire = new Beneficiaire({
      nom,
      prenom,
      dateNaissance,
      niveau,
      formation: formationId,
      isBlack: isBlack ?? false,
      isSuturate: isSuturate ?? false,
    });

    await beneficiaire.save();

    // Créer une séance associée au bénéficiaire et à la formation
    const seance = new Seance({
      formation: formationId,
      beneficiaire: beneficiaire._id,
      presence: [
        {
          date: new Date(), // Date actuelle
          present: false, // Par défaut, le bénéficiaire n'est pas encore présent
        },
      ],
    });

    await seance.save();

    res.status(201).json({
      message: "Beneficiaire created successfully with an associated Seance",
      beneficiaire,
      seance,
    });

  } catch (error) {
    res.status(500).json({ message: "Error creating beneficiaire", error: error.message });
  }
};


// Get all Beneficiaires (with optional formation details)
const getAllBeneficiaires = async (req, res) => {
  try {
    const beneficiaires = await Beneficiaire.find().populate("formation");
    res.status(200).json(beneficiaires);
  } catch (error) {
    res.status(500).json({ message: "Error fetching beneficiaires", error: error.message });
  }
};

// Get a single Beneficiaire by ID (with formation details)
const getBeneficiaireById = async (req, res) => {
  try {
    const beneficiaire = await Beneficiaire.findById(req.params.id).populate("formation");
    if (!beneficiaire) {
      return res.status(404).json({ message: "Beneficiaire not found" });
    }
    res.status(200).json(beneficiaire);
  } catch (error) {
    res.status(500).json({ message: "Error fetching beneficiaire", error: error.message });
  }
};

// Update a Beneficiaire
const updateBeneficiaire = async (req, res) => {
  try {
    const { nom, prenom, dateNaissance, niveau, formationId, isBlack, isSuturate } = req.body;

    // Check if formation exists before updating
    if (formationId) {
      const formationExists = await Formation.findById(formationId);
      if (!formationExists) {
        return res.status(404).json({ message: "Formation not found" });
      }
    }

    const updatedBeneficiaire = await Beneficiaire.findByIdAndUpdate(
      req.params.id,
      { nom, prenom, dateNaissance, niveau, formation: formationId, isBlack, isSuturate },
      { new: true, runValidators: true }
    ).populate("formation");

    if (!updatedBeneficiaire) {
      return res.status(404).json({ message: "Beneficiaire not found" });
    }

    res.status(200).json(updatedBeneficiaire);
  } catch (error) {
    res.status(500).json({ message: "Error updating beneficiaire", error: error.message });
  }
};

// Delete a Beneficiaire
const deleteBeneficiaire = async (req, res) => {
  try {
    const deletedBeneficiaire = await Beneficiaire.findByIdAndDelete(req.params.id);
    if (!deletedBeneficiaire) {
      return res.status(404).json({ message: "Beneficiaire not found" });
    }
    res.status(200).json({ message: "Beneficiaire deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting beneficiaire", error: error.message });
  }
};

// Upload beinificiaire excel data directly to database
const uploadBeneficiairesFromExcel = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Read the file as a buffer
    const workbook = XLSX.read(req.file.buffer, { type: "buffer" });

    // Debugging logs
    console.log("Workbook:", workbook);
    console.log("Sheet Names:", workbook.SheetNames);

    if (!workbook.SheetNames.length) {
      return res.status(400).json({ message: "No sheets found in the uploaded Excel file" });
    }

    // Get first sheet
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    if (!worksheet) {
      return res.status(400).json({ message: "First sheet is empty or not found" });
    }

    // Convert the worksheet to JSON
    const rawData = XLSX.utils.sheet_to_json(worksheet);
    console.log("Parsed Data:", rawData); // Log to debug

    // Transform data to match MongoDB schema
    const beneficiaires = rawData.map(item => ({
      horodateur: item["Horodateur"] || null,
      email: item["Email"] || null,
      prenom: typeof item["Prénom"] === "string" ? item["Prénom"].trim() : null,
      nom: typeof item["Nom"] === "string" ? item["Nom"].trim() : null,
      genre: item["Genre"] || null,
      dateDeNaissance: item["Date de naissance"] 
        ? new Date((item["Date de naissance"] - 25569) * 86400000) 
        : null, // Convert Excel date
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
    

    // Insert into MongoDB
    // const insertedBeneficiaires = await Beneficiaire.insertMany(beneficiaires);

    // const beneficiareFormations = insertedBeneficiaires.map(b => ({
    //   formation: idFormation,
    //   beneficiaires: b._id, // Associer le bénéficiaire
    //   confirmationAppel: false,
    //   confirmationEmail: false,
    // }));

    res.status(200).json({ message: "Beneficiaires uploaded successfully", data: insertedBeneficiaires });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error uploading beneficiaires", error: error.message });
  }
};

// Simple read data from excel testing
const uploadBenificiaireExcel = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Please upload an Excel file" });
    }

    const filePath = req.file.path;

    console.log(`File uploaded to: ${filePath}`); // Log the file path to confirm where the file is stored

    const data = readExcelFile(filePath);

    console.log(data);

    res.status(200).json({ message: "Data uploaded successfully", data });
  } catch (error) {
    console.error("Error processing file:", error);
    res.status(500).json({ message: "Error processing file", error: error.message });
  }
}

// Export the functions for use in routes
module.exports = {
    getAllBeneficiaires,
    getBeneficiaireById,
    updateBeneficiaire,
    deleteBeneficiaire,
    uploadBeneficiairesFromExcel
};