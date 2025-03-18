const Beneficiaire = require("../Models/beneficiaire.model");
const Formation = require("../Models/formation.model");
const readExcelFile = require("../utils/excelReader");
const XLSX = require("xlsx");
const  BeneficiareFormation=require("../Models/beneficiairesFormation.js");
const mongoose = require('mongoose');
const Formateur=require("../Models/formateur.model");
const {parseExcelFile} =require("../utils/excelUtils.js");
const {getExistingBeneficiairesHashes, isDuplicateBeneficiaire }= require("../utils/existedBenef.js");
const { hashBeneficiaire } = require("../utils/hashBenef");

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
    // Trouver d'abord tous les bénéficiaires pour obtenir leurs IDs
    const beneficiaires = await Beneficiaire.find({});
    
    if (beneficiaires.length === 0) {
      return res.status(404).json({ message: "Aucun bénéficiaire trouvé" });
    }
    
    // Extraire les IDs des bénéficiaires
    const beneficiaireIds = beneficiaires.map(b => b._id);
    
    // Supprimer toutes les instances liées dans BeneficiareFormation
    await BeneficiareFormation.deleteMany({ beneficiaire: { $in: beneficiaireIds } });
    
    // Ensuite, supprimer les bénéficiaires
    const result = await Beneficiaire.deleteMany({});
    
    res.status(200).json({ 
      message: `Tous les bénéficiaires ont été supprimés avec succès, ainsi que leurs Beneficiaireformations associées`,
      deletedBeneficiaires: result.deletedCount
    });
  } catch (error) {
    res.status(500).json({ 
      message: "Erreur lors de la suppression des bénéficiaires", 
      error: error.message 
    });
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
  console.log("uploadBeneficiairesFromExcel!!!!!!!!!!! ENDPOINT");
  try {
    const idFormation = req.body.idFormation;
    if (!idFormation || !mongoose.Types.ObjectId.isValid(idFormation)) {
      return res.status(400).json({ message: "ID de formation invalide ou manquant" });
    }
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const rawBeneficiaires = parseExcelFile(req.file.buffer);
    const existingBeneficiaires = await getExistingBeneficiairesHashes();

    // Transformer en Map pour accès rapide
    const existingMap = new Map(existingBeneficiaires.map(b => [b.hash, b.id]));

    const newBeneficiaires = [];
    const existingBeneficiairesToUpdate = [];

    for (const b of rawBeneficiaires) {
      const hash = hashBeneficiaire(b.email, b.nom, b.prenom);
      if (existingMap.has(hash)) {
        const beneficiaireId = existingMap.get(hash);
        existingBeneficiairesToUpdate.push(beneficiaireId);
      } else {
        newBeneficiaires.push(b);
      }
    }

    // Vérifier si des bénéficiaires existent déjà avec cette formation
    const formationsExistantes = await BeneficiareFormation.find({
      beneficiaire: { $in: existingBeneficiairesToUpdate },
      formation: idFormation
    }).select("beneficiaire");

    const beneficiairesAvecFormation = new Set(formationsExistantes.map(f => f.beneficiaire.toString()));

    const nouvellesInstances = existingBeneficiairesToUpdate
      .filter(id => !beneficiairesAvecFormation.has(id.toString()))
      .map(id => ({
        formation: new mongoose.Types.ObjectId(idFormation),
        beneficiaire: id,
        confirmationAppel: false,
        confirmationEmail: false,
      }));

    // Transaction
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      if (newBeneficiaires.length > 0) {
        const insertedBeneficiaires = await Beneficiaire.insertMany(newBeneficiaires, { session });
        const beneficiareFormations = insertedBeneficiaires.map(b => ({
          formation: new mongoose.Types.ObjectId(idFormation),
          beneficiaire: b._id,
          confirmationAppel: false,
          confirmationEmail: false,
        }));
        await BeneficiareFormation.insertMany(beneficiareFormations, { session });
      }

      if (nouvellesInstances.length > 0) {
        await BeneficiareFormation.insertMany(nouvellesInstances, { session });
      }

      await session.commitTransaction();
      res.status(200).json({
        message: "Traitement terminé avec succès",
        nouveauxBeneficiaires: newBeneficiaires.length,
        nouvellesInstances: nouvellesInstances.length
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
// debut:end point de qui sera appeler dans l'etape 3 dans le stepers pour enregister les confirmations
const updateBeneficiaireConfirmations = async (req, res) => {
  try {
    const confirmationsList = req.body; // Liste des confirmations à mettre à jour
    
    if (!Array.isArray(confirmationsList)) {
      return res.status(400).json({ success: false, message: "Le corps de la requête doit être un tableau" });
    }
    
    if (!confirmationsList.length) {
      return res.status(400).json({ success: false, message: "Le tableau de confirmations est vide" });
    }
    
    // Vérification de la structure des données
    for (const item of confirmationsList) {
      if (!item.id) {
        return res.status(400).json({ 
          success: false, 
          message: "Chaque élément doit contenir un _id de formationBeneficiaire" 
        });
      }
    }
    // Tableau pour stocker les promesses de mise à jour
    const updatePromises = confirmationsList.map(async (item) => {
      // Récupérer uniquement les champs qui nous intéressent
      const updateData = {
        confirmationAppel: item.confirmationAppel,
        confirmationEmail: item.confirmationEmail
      };
      
      // Mettre à jour le document avec l'ID spécifié
      const updated = await BeneficiareFormation.findByIdAndUpdate(
        item.id,
        { $set: updateData },
        { new: true } // Retourner le document mis à jour
      );
      
      return updated;
    });
    
    // Exécuter toutes les mises à jour en parallèle
    const results = await Promise.all(updatePromises);
    
    // Filtrer pour obtenir uniquement les mises à jour réussies
    const successfulUpdates = results.filter(result => result !== null);
    
    return res.status(200).json({
      success: true,
      message: `${successfulUpdates.length} sur ${confirmationsList.length} confirmations mises à jour avec succès`,
      updatedItems: successfulUpdates
    });
    
  } catch (error) {
    console.error('Erreur lors de la mise à jour des confirmations:', error);
    return res.status(500).json({
      success: false,
      message: "Une erreur est survenue lors de la mise à jour des confirmations",
      error: error.message
    });
  }
};
// fin:end point de qui sera appeler dans l'etape 3 dans le stepers pour enregister les confirmations

// Export the functions for use in routes
module.exports = {
    getAllBeneficiaires,
    getBeneficiaireById,
    updateBeneficiaire,
    deleteBeneficiaire,
    uploadBeneficiairesFromExcel,
    createBeneficiaire,
    getBeneficiaireFormation,
    getNombreBeneficiairesParFormateur,
    updateBeneficiaireConfirmations
};
