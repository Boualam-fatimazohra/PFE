const Beneficiaire = require("../Models/beneficiaire.model");
const Formation = require("../Models/formation.model");
const readExcelFile = require("../utils/excelReader");
const XLSX = require("xlsx");
const  BeneficiareFormation=require("../Models/beneficiairesFormation.js");
const mongoose = require('mongoose');
const Formateur=require("../Models/formateur.model");
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
  telephone,
  pays,
  niveau,
  specialite,
  etablissement,
  profession,
  situationProfessionnel,
  isBlack,
  isSaturate,
  nationalite,
  region,
  categorieAge,
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
        dateNaissance,
        email,
        genre,
        telephone,
        pays,
        niveau,
        specialite,
        etablissement,
        profession,
        situationProfessionnel,
        isBlack,
        isSaturate,
        nationalite,
        region,
        categorieAge,
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
    const beneficiaires = await Beneficiaire.find();
    res.status(200).json(beneficiaires);
  } catch (error) {
    res.status(500).json({ message: "Error fetching beneficiaires", error: error.message });
  }
};

// Get a single Beneficiaire by ID (with formation details)
const getBeneficiaireById = async (req, res) => {
  try {
    const beneficiaire = await Beneficiaire.findById(req.params.id);
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
    const {  isBlack, isSuturate } = req.body;

    // todo:  Check if formation exists before updating by chcking formtionId passed in params
    const updatedBeneficiaire = await Beneficiaire.findByIdAndUpdate(
      req.params.id,
      {isBlack, isSuturate },
      { new: true, runValidators: true }
    );

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
const getBeneficiaireFormation = async (req, res) => {
  const idFormation = req.params.id || req.body.idFormation;
  console.log("ID Formation reçu :", idFormation); // Debug
  
  try {
    // Vérifier si l'ID est valide
    if (!idFormation || !mongoose.Types.ObjectId.isValid(idFormation.toString())) {
      return res.status(400).json({ message: "ID de formation invalide" });
    }
    
    // Convertir en ObjectId pour éviter les problèmes
    const formationId = new mongoose.Types.ObjectId(idFormation.toString());
    
    // Récupérer les bénéficiaires liés à la formation
    const beneficiaires = await BeneficiareFormation.find({ formation: formationId })
      .populate({
        path: "beneficiaire",
        model: "Beneficiaire", // S'assurer que c'est bien le bon modèle
      });

    // Vérifier si on a trouvé des bénéficiaires
    if (!beneficiaires.length) {
      return res.status(404).json({ message: "Aucun bénéficiaire trouvé pour cette formation" });
    }

    res.status(200).json(beneficiaires);
  } catch (error) {
    console.error("Erreur lors de la récupération des bénéficiaires:", error);
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};


const getNombreBeneficiairesParFormateur = async (req, res) => {
  console.log("debut de la fct getNbrBeneficiaire par formateur");
  try {
    const utilisateurId = req.user.userId;
    if (!mongoose.Types.ObjectId.isValid(utilisateurId)) {
      return res.status(400).json({ message: "ID utilisateur invalide" });
    }

    const formateur = await Formateur.findOne({ utilisateur: utilisateurId });
    
    if (!formateur) {
      return res.status(404).json({ message: "Formateur non trouvé" });
    }

    const formations = await Formation.find({ formateur: formateur._id }).select("_id");

    if (formations.length === 0) {
      return res.json({ nombreBeneficiaires: 0 });
    }

    // CORRECTION ICI 
    const formationIds = formations.map(f => f._id); 

    const nombreBeneficiaires = await BeneficiareFormation.countDocuments({
      formation: { $in: formationIds }
    });

    res.json({ nombreBeneficiaires });

  } catch (error) {
    console.error("Erreur :", error);
    res.status(500).json({ message: "Erreur interne du serveur", error: error.message });
  }
};

// Export the functions for use in routes
module.exports = {
    getAllBeneficiaires,
    getBeneficiaireById,
    updateBeneficiaire,
    deleteBeneficiaire,
    uploadBeneficiairesFromExcel,
    createBeneficiaire,
    getBeneficiaireFormation,
    getNombreBeneficiairesParFormateur
};
