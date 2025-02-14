const Beneficiaire = require("../Models/beneficiaire.model");
const Formation = require("../Models/formation.model");
const readExcelFile = require("../utils/excelReader");

// Create a new Beneficiaire
const createBeneficiaire = async (req, res) => {
    try {
      const { nom, prenom, dateNaissance, niveau, formationId, isBlack, isSuturate } = req.body;
  
      // Ensure formationId is provided
      if (!formationId) {
        return res.status(400).json({ message: "A formationId is required" });
      }
  
      // Check if the referenced formation exists
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
      res.status(201).json(beneficiaire);
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
    createBeneficiaire,
    getAllBeneficiaires,
    getBeneficiaireById,
    updateBeneficiaire,
    deleteBeneficiaire,
    uploadBenificiaireExcel,
};