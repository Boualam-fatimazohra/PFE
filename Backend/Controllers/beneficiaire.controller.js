const Beneficiaire = require("../Models/beneficiaire.model");
const Formation = require("../Models/formation.model");
const readExcelFile = require("../utils/excelReader");
const XLSX = require("xlsx");
const  BeneficiareFormation=require("../Models/beneficiairesFormation.js");
const mongoose = require('mongoose');
const Formateur=require("../Models/formateur.model");
const {parseExcelFile} =require("../utils/excelUtils.js");
const {getExistingBeneficiairesHashes, isDuplicateBeneficiaire }= require("../utils/existedBenef.js");

const createBeneficiaire = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    const { idFormation, ...beneficiaireData } = req.body;
    const requiredFields = ['nom', 'email', 'genre', 'pays'];

    // 1. Validation de base
    const missingFields = requiredFields.filter(field => !beneficiaireData[field]);
    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Champs manquants: ${missingFields.join(', ')}`
      });
    }

    // 2. Validation ID Formation
    if (!idFormation || !mongoose.Types.ObjectId.isValid(idFormation)) {
      return res.status(400).json({
        success: false,
        message: "ID de formation invalide"
      });
    }

    // 3. Validation email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(beneficiaireData.email)) {
      return res.status(400).json({
        success: false,
        message: "Format d'email invalide"
      });
    }

    // 4. Vérification email unique
    const existingBeneficiaire = await Beneficiaire.findOne({ email: beneficiaireData.email }).session(session);
    if (existingBeneficiaire) {
      await session.abortTransaction();
      return res.status(409).json({
        success: false,
        message: "Email déjà utilisé"
      });
    }

    // 5. Validation des enums
    const validateEnum = (field, value) => {
      const enumValues = Beneficiaire.schema.path(field).enumValues;
      return enumValues.includes(value);
    };

    const enumValidations = {
      niveau: beneficiaireData.niveau,
      situationProfessionnel: beneficiaireData.situationProfessionnel,
      region: beneficiaireData.region,
      categorieAge: beneficiaireData.categorieAge
    };

    for (const [field, value] of Object.entries(enumValidations)) {
      if (value && !validateEnum(field, value)) {
        return res.status(400).json({
          success: false,
          message: `Valeur invalide pour ${field}: ${value}`
        });
      }
    }

    // 6. Validation type téléphone
    if (beneficiaireData.telephone && isNaN(beneficiaireData.telephone)) {
      return res.status(400).json({
        success: false,
        message: "Le téléphone doit être un nombre"
      });
    }

    // 7. Création du bénéficiaire
    const newBeneficiaire = new Beneficiaire({
      ...beneficiaireData,
      telephone: beneficiaireData.telephone ? Number(beneficiaireData.telephone) : undefined
    });

    const savedBeneficiaire = await newBeneficiaire.save({ session });

    // 8. Validation existence formation
    const formation = await Formation.findById(idFormation).session(session);
    if (!formation) {
      await session.abortTransaction();
      return res.status(404).json({
        success: false,
        message: "Formation introuvable"
      });
    }

    // 9. Création de la relation
    const newRelation = new BeneficiareFormation({
      formation: idFormation,
      beneficiaire: savedBeneficiaire._id,
      confirmationAppel: false,
      confirmationEmail: false,
      horodateur: new Date(),
      isSubmited: false
    });

    const savedRelation = await newRelation.save({ session });

    await session.commitTransaction();
    
    return res.status(201).json({
      success: true,
      data: {
        beneficiaire: savedBeneficiaire,
        relation: savedRelation
      }
    });

  } catch (error) {
    await session.abortTransaction();
    
    // Gestion spécifique des erreurs Mongoose
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => ({
        field: err.path,
        message: err.message
      }));
      
      return res.status(400).json({
        success: false,
        message: "Erreur de validation",
        errors
      });
    }

    console.error(`[${new Date().toISOString()}] Erreur critique:`, error);
    
    return res.status(500).json({
      success: false,
      message: "Erreur interne du serveur",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
    
  } finally {
    session.endSession();
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

// const uploadBeneficiairesFromExcel = async (req, res) => {
//   try {
//     // Vérifier que idFormation est présent et valide
//     const idFormation = req.body.idFormation; // Assurez-vous que c'est bien dans le body
    
//     if (!idFormation || !mongoose.Types.ObjectId.isValid(idFormation)) {
//       return res.status(400).json({ 
//         message: "ID de formation invalide ou manquant",
//         error: "Invalid formation ID" 
//       });
//     }

//     if (!req.file) {
//       return res.status(400).json({ message: "No file uploaded" });
//     }
     
//     const workbook = XLSX.read(req.file.buffer, { type: "buffer" });
//     if (!workbook.SheetNames.length) {
//       return res.status(400).json({ message: "No sheets found in the uploaded Excel file" });
//     }

//     // Get first sheet
//     const sheetName = workbook.SheetNames[0];
//     const worksheet = workbook.Sheets[sheetName];
//     if (!worksheet) {
//       return res.status(400).json({ message: "First sheet is empty or not found" });
//     }

//     // Convert the worksheet to JSON
//     const rawData = XLSX.utils.sheet_to_json(worksheet);
    
//     // Transform data to match MongoDB schema
//     const beneficiaires = rawData.map(item => ({
//       horodateur: item["Horodateur"] || null,
//       email: item["Email"] || null,
//       prenom: typeof item["Prénom"] === "string" ? item["Prénom"].trim() : null,
//       nom: typeof item["Nom"] === "string" ? item["Nom"].trim() : null,
//       genre: item["Genre"] || null,
//       dateDeNaissance: item["Date de naissance"]
//         ? new Date((item["Date de naissance"] - 25569) * 86400000)
//         : null,
//       pays: typeof item["Pays"] === "string" ? item["Pays"].trim() : null,
//       situationProfessionnelle: item["Situation Profetionnelle"] || null,
//       profession: typeof item["Profession"] === "string" ? item["Profession"].trim() : null,
//       age: item["Votre age"] || null,
//       telephone: item["Télélphone"] || null,
//       niveauEtudes: item["Niveau d'etudes"] || null,
//       experienceGestionProjet: item["Avez vous une expérience avec la gestion de projet."] || null,
//       specialite: typeof item["Votre spécialité"] === "string" ? item["Votre spécialité"].trim() : null,
//       etablissement: typeof item["Établissement"] === "string" ? item["Établissement"].trim() : null,
//       dejaParticipeODC: item["Avez-vous déja participé au programmes ODC"] || null,
//     }));
   
//     // Utiliser une session MongoDB pour garantir l'atomicité
//     const session = await mongoose.startSession();
//     session.startTransaction();

//     try {
//       const insertedBeneficiaires = await Beneficiaire.insertMany(beneficiaires, { session });
//       const beneficiareFormations = insertedBeneficiaires.map(b => ({
//         formation: new mongoose.Types.ObjectId(idFormation), // Convertir en ObjectId
//         beneficiaire: b._id,
//         confirmationAppel: false,
//         confirmationEmail: false,
//       }));

//       // Insérer les instances de BeneficiareFormation
//       await BeneficiareFormation.insertMany(beneficiareFormations, { session });
      
//       await session.commitTransaction();
      
//       res.status(200).json({ 
//         message: "Beneficiaires uploaded successfully", 
//         count: insertedBeneficiaires.length 
//       });
//     } catch (error) {
//       await session.abortTransaction();
//       throw error;
//     } finally {
//       session.endSession();
//     }
//   } catch (error) {
//     console.error('Upload error:', error);
//     res.status(500).json({ 
//       message: "Error uploading beneficiaires", 
//       error: error.message 
//     });
//   }
// };
// Simple read data from excel testing
const uploadBeneficiairesFromExcel = async (req, res) => {
  try {
    const idFormation = req.body.idFormation;

    if (!idFormation || !mongoose.Types.ObjectId.isValid(idFormation)) {
      return res.status(400).json({ message: "ID de formation invalide ou manquant" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const rawBeneficiaires = parseExcelFile(req.file.buffer);

    // Récupérer la liste des bénéficiaires déjà enregistrés sous forme de hash
    const existingHashes = await getExistingBeneficiairesHashes();
    // console.log("beneficiaires hashee", existingHashes);
    rawBeneficiaires.forEach(b => {
      const isDuplicate = isDuplicateBeneficiaire(b, existingHashes);
      console.log(`Bénéficiaire: ${b.nom}, Email: ${b.email}, Doublon: ${isDuplicate}`);
    });
    // Filtrer les nouveaux bénéficiaires qui ne sont pas déjà stockés
    const newBeneficiaires = rawBeneficiaires.filter(b => !isDuplicateBeneficiaire(b, existingHashes));
    console.log("Données des nouveaux bénéficiaires avant insertion:", newBeneficiaires);
    if (newBeneficiaires.length === 0) {
      return res.status(200).json({ message: "Tous les bénéficiaires sont déjà enregistrés." });
    }
    newBeneficiaires.forEach(b => {
      if (!b.nom || !b.email || !b.genre || !b.pays) {
        console.error("Bénéficiaire invalide détecté :", b);
      }
    });
    
    // Début de la transaction
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const insertedBeneficiaires = await Beneficiaire.insertMany(newBeneficiaires, { session });

      const beneficiareFormations = insertedBeneficiaires.map(b => ({
        formation: new mongoose.Types.ObjectId(idFormation),
        beneficiaire: b._id,
        confirmationAppel: false,
        confirmationEmail: false,
      }));

      await BeneficiareFormation.insertMany(beneficiareFormations, { session });

      await session.commitTransaction();
      
      res.status(200).json({ 
        message: "Bénéficiaires uploadés avec succès", 
        count: insertedBeneficiaires.length 
      });
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ message: "Erreur lors de l'upload", error: error.message });
  }
};
const getBeneficiaireFormation = async (req, res) => {
  console.log('Requête reçue sur:', req.originalUrl); //  Debug
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
        model: "Beneficiaire", 
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
  const  utilisateurId = req.user.userId;
  const role=req.user.role;
  let formateur; // Déclaration dans la portée supérieure

  try {
    if (role === "Formateur") {
      if (!mongoose.Types.ObjectId.isValid(utilisateurId)) {
        return res.status(400).json({ message: "ID utilisateur invalide" });
      }

      formateur = await Formateur.findOne({ utilisateur: utilisateurId }); // Assignation

    } else if (role === "Manager") {
      const id = req.body.idFormateur;

      if (!id) {
        return res.status(400).json({ message: "idFormateur requis dans le body" });
      }
      
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "ID formateur invalide" });
      }

      formateur = await Formateur.findById(id); // Correction: .findById(id) au lieu de .findById({id})

    } else {
      // Cas où le rôle n'est ni Formateur ni Manager
      return res.status(403).json({ message: "Accès interdit" });
    }

    if (!formateur) {
      return res.status(404).json({ message: "Formateur non trouvé" });
    }

    // Le reste reste inchangé
    const formations = await Formation.find({ formateur: formateur._id }).select("_id");

    if (formations.length === 0) {
      return res.json({ nombreBeneficiaires: 0 });
    }

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
