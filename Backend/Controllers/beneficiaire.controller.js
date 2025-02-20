const Beneficiaire = require("../Models/beneficiaire.model");
const Formation = require("../Models/formation.model");
const readExcelFile = require("../utils/excelReader");
const XLSX = require("xlsx");
const  BeneficiareFormation=require("../Models/beneficiairesFormation.js");
const mongoose = require('mongoose');
const createBeneficiaire = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
      // Extraction des données du body
      const {
          nom,
          prenom,
          dateNaissance,
          email,
          genre,
          pays,
          niveau,
          specialite,
          etablissement,
          profession,
          nationalite,
          idFormation 
      } = req.body;
      // Validation de l'idFormation
      if (!idFormation || !mongoose.Types.ObjectId.isValid(idFormation)) {
          return res.status(400).json({
              success: false,
              message: "ID de formation invalide ou manquant"
          });
      }
      // Validation des champs requis
      if (!nom || !email || !genre || !pays) {
          return res.status(400).json({
              success: false,
              message: "Les champs nom, email, genre et pays sont obligatoires"
          });
      }
      // Validation du format email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
          return res.status(400).json({
              success: false,
              message: "Format d'email invalide"
          });
      }
      // Vérification si l'email existe déjà
      const existingBeneficiaire = await Beneficiaire.findOne({ email }).session(session);
      if (existingBeneficiaire) {
          await session.abortTransaction();
          return res.status(409).json({
              success: false,
              message: "Un bénéficiaire avec cet email existe déjà"
          });
      }
      // Création du nouveau bénéficiaire
      const newBeneficiaire = new Beneficiaire({
          nom,
          prenom,
          dateNaissance: dateNaissance ? new Date(dateNaissance) : undefined,
          email,
          genre,
          pays,
          niveau,
          specialite,
          etablissement,
          profession,
          nationalite,
          isBlack: false,
          isSaturate: false
      });

      // Sauvegarde du bénéficiaire
      const savedBeneficiaire = await newBeneficiaire.save({ session });

      try {
        // Après la sauvegarde du bénéficiaire
        console.log('Bénéficiaire sauvegardé avec succès');
        
        // Vérification de l'existence de la formation
        const formationExists = await Formation.findById(idFormation).session(session);
        if (!formationExists) {
            throw new Error('Formation non trouvée');
        }
    
        // Création de l'instance BeneficiareFormation avec try/catch spécifique
        try {
            const newBeneficiareFormation = new BeneficiareFormation({
                formation: idFormation,
                beneficiaire: savedBeneficiaire._id,
                confirmationAppel: false,
                confirmationEmail: false,
                horodateur: new Date(),
                isSubmited: false
            });
    
            console.log('Instance BeneficiareFormation créée:', newBeneficiareFormation);
            
            const savedBeneficiareFormation = await newBeneficiareFormation.save({ session });
            console.log('BeneficiareFormation sauvegardé avec succès');
    
            await session.commitTransaction();
            
            res.status(201).json({
                success: true,
                message: "Bénéficiaire et association à la formation créés avec succès",
                data: {
                    beneficiaire: savedBeneficiaire,
                    beneficiareFormation: savedBeneficiareFormation
                }
            });
        } catch (formationError) {
            console.error('Erreur lors de la création de BeneficiareFormation:', formationError);
            throw formationError;
        }
    } catch (error) {
        await session.abortTransaction();
        console.error('Erreur détaillée:', {
            message: error.message,
            stack: error.stack,
            name: error.name
        });
        
        res.status(500).json({
            success: false,
            message: "Erreur lors de la création",
            error: error.message,
            details: error.stack
        });
    } finally {
        session.endSession();
    }} catch (error) {
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
    const result = await Beneficiaire.deleteMany({}); 

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Aucun bénéficiaire trouvé" });
    }

    res.status(200).json({ message: "Tous les bénéficiaires ont été supprimés avec succès" });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la suppression des bénéficiaires", error: error.message });
  }
};


// Upload beinificiaire excel data directly to database

const uploadBeneficiairesFromExcel = async (req, res) => {
  try {
    // Vérifier que idFormation est présent et valide
    const idFormation = req.body.idFormation; // Assurez-vous que c'est bien dans le body
    
    if (!idFormation || !mongoose.Types.ObjectId.isValid(idFormation)) {
      return res.status(400).json({ 
        message: "ID de formation invalide ou manquant",
        error: "Invalid formation ID" 
      });
    }

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
     
    const workbook = XLSX.read(req.file.buffer, { type: "buffer" });
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
    
    // Transform data to match MongoDB schema
    const beneficiaires = rawData.map(item => ({
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
   
    // Utiliser une session MongoDB pour garantir l'atomicité
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      
      const insertedBeneficiaires = await Beneficiaire.insertMany(beneficiaires, { session });
      
      const beneficiareFormations = insertedBeneficiaires.map(b => ({
        formation: new mongoose.Types.ObjectId(idFormation), // Convertir en ObjectId
        beneficiaire: b._id,
        confirmationAppel: false,
        confirmationEmail: false,
      }));

      // Insérer les instances de BeneficiareFormation
      await BeneficiareFormation.insertMany(beneficiareFormations, { session });
      
      await session.commitTransaction();
      
      res.status(200).json({ 
        message: "Beneficiaires uploaded successfully", 
        count: insertedBeneficiaires.length 
      });
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ 
      message: "Error uploading beneficiaires", 
      error: error.message 
    });
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
    uploadBeneficiairesFromExcel,
    createBeneficiaire
};