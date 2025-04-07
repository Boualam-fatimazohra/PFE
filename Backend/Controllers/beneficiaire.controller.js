const Beneficiaire = require("../Models/beneficiaire.model");
const Formation = require("../Models/formation.model");
const readExcelFile = require("../utils/excelReader");
const XLSX = require("xlsx");
const path = require("path");
const fs = require("fs");
const BeneficiaireFormation = require("../Models/beneficiairesFormation.js");
const mongoose = require('mongoose');
const Formateur=require("../Models/formateur.model");
const {parseExcelFile} =require("../utils/excelUtils.js");
const {getExistingBeneficiairesHashes }= require("../utils/existedBenef.js");
const { hashBeneficiaire } = require("../utils/hashBenef");
const Presence = require('../Models/presence.model.js');
const { getBeneficiairesByFormation,
    getPresencesByBeneficiaires,
    getOtherFormationsByBeneficiaire }=require("../utils/BeneficiairePresence.js")

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
    const newRelation = new BeneficiaireFormation({
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
    await BeneficiaireFormation.deleteMany({ beneficiaire: { $in: beneficiaireIds } });
    
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
// const uploadBeneficiairesFromExcel = async (req, res) => {
//   try {
//     const idFormation = req.body.idFormation;

//     if (!idFormation || !mongoose.Types.ObjectId.isValid(idFormation)) {
//       return res.status(400).json({ message: "ID de formation invalide ou manquant" });
//     }

//     if (!req.file) {
//       return res.status(400).json({ message: "No file uploaded" });
//     }

//     const rawBeneficiaires = parseExcelFile(req.file.buffer);

//     // Récupérer la liste des bénéficiaires déjà enregistrés sous forme de hash
//     const existingHashes = await getExistingBeneficiairesHashes();
//     // console.log("beneficiaires hashee", existingHashes);
//     rawBeneficiaires.forEach(b => {
//       const isDuplicate = isDuplicateBeneficiaire(b, existingHashes);
//       console.log(`Bénéficiaire: ${b.nom}, Email: ${b.email}, Doublon: ${isDuplicate}`);
//     });
//     // Filtrer les nouveaux bénéficiaires qui ne sont pas déjà stockés
//     const newBeneficiaires = rawBeneficiaires.filter(b => !isDuplicateBeneficiaire(b, existingHashes));
//     console.log("Données des nouveaux bénéficiaires avant insertion:", newBeneficiaires);
//     if (newBeneficiaires.length === 0) {
//       return res.status(200).json({ message: "Tous les bénéficiaires sont déjà enregistrés." });
//     }
//     newBeneficiaires.forEach(b => {
//       if (!b.nom || !b.email || !b.genre || !b.pays) {
//         console.error("Bénéficiaire invalide détecté :", b);
//       }
//     });
    
//     // Début de la transaction
//     const session = await mongoose.startSession();
//     session.startTransaction();

//     try {
//       const insertedBeneficiaires = await Beneficiaire.insertMany(newBeneficiaires, { session });

//       const beneficiareFormations = insertedBeneficiaires.map(b => ({
//         formation: new mongoose.Types.ObjectId(idFormation),
//         beneficiaire: b._id,
//         confirmationAppel: false,
//         confirmationEmail: false,
        

//       }));

//       await BeneficiareFormation.insertMany(beneficiareFormations, { session });

//       await session.commitTransaction();
      
//       res.status(200).json({ 
//         message: "Bénéficiaires uploadés avec succès", 
//         count: insertedBeneficiaires.length 
//       });
//     } catch (error) {
//       await session.abortTransaction();
//       throw error;
//     } finally {
//       session.endSession();
//     }
//   } catch (error) {
//     console.error("Upload error:", error);
//     res.status(500).json({ message: "Erreur lors de l'upload", error: error.message });
//   }
// };
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
    const formationsExistantes = await BeneficiaireFormation.find({
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
        await BeneficiaireFormation.insertMany(beneficiareFormations, { session });
      }

      if (nouvellesInstances.length > 0) {
        await BeneficiaireFormation.insertMany(nouvellesInstances, { session });
      }

      await session.commitTransaction();
      console.log("les beneficiaires ajouté sont ",newBeneficiaires);
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
    const beneficiaires = await BeneficiaireFormation.find({ formation: formationId })
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
    const nombreBeneficiaires = await BeneficiaireFormation.countDocuments({
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
      const updated = await BeneficiaireFormation.findByIdAndUpdate(
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

const exportBeneficiairesToExcel = async (req, res) => {
  try {
    const { formationId } = req.params;
    
    // Validation de l'ID
    if (!formationId || !mongoose.Types.ObjectId.isValid(formationId)) {
      return res.status(400).json({
        success: false,
        message: "ID de formation invalide"
      });
    }

    // Vérification de l'existence de la formation
    const formation = await Formation.findById(formationId);
    if (!formation) {
      return res.status(404).json({
        success: false,
        message: "Formation introuvable"
      });
    }

    // Récupération des relations formation-bénéficiaires
    const beneficiaireRelations = await BeneficiaireFormation.find({ 
      formation: formationId 
    }).populate('beneficiaire');

    if (beneficiaireRelations.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Aucun bénéficiaire trouvé pour cette formation"
      });
    }

    // Préparation des données pour Excel
    const workbook = XLSX.utils.book_new();
    
    // Données formatées pour la feuille Excel
    const excelData = beneficiaireRelations.map(relation => {
      const b = relation.beneficiaire;
      if (!b) return null; // Skip if beneficiaire is null (shouldn't happen with proper DB integrity)
      
      return {
        'Nom': b.nom || '',
        'Prénom': b.prenom || '',
        'Email': b.email || '',
        'Téléphone': b.telephone || '',
        'Genre': b.genre || '',
        'Pays': b.pays || '',
        'Région': b.region || '',
        'Date de naissance': b.categorieAge || '',
        'Catégorie d\'âge': b.categorieAge || '',
        'Situation professionnelle': b.situationProfessionnel || '',
        'Niveau d\'études': b.niveau || '',
        'Spécialité': b.specialite || '',
        'Établissement': b.etablissement || '',
        'Confirmation appel': relation.confirmationAppel ? 'Oui' : 'Non',
        'Confirmation email': relation.confirmationEmail ? 'Oui' : 'Non',
        'Évaluation soumise': relation.isSubmited ? 'Oui' : 'Non',
        'Date d\'inscription': relation.horodateur ? new Date(relation.horodateur).toLocaleString('fr-FR') : '',
        'Liste noire': b.isBlack ? 'Oui' : 'Non',
        'Saturé': b.isSaturate ? 'Oui' : 'Non'
      };
    }).filter(item => item !== null); // Remove null entries
    
    // Création de la feuille de calcul
    const worksheet = XLSX.utils.json_to_sheet(excelData);
    
    // Configuration des largeurs de colonnes
    const colWidths = [
      { wch: 15 }, // Nom
      { wch: 15 }, // Prénom
      { wch: 30 }, // Email
      { wch: 15 }, // Téléphone
      { wch: 10 }, // Genre
      { wch: 15 }, // Pays
      { wch: 15 }, // Région
      { wch: 15 }, // Date de naissance
      { wch: 15 }, // Catégorie d'âge
      { wch: 25 }, // Situation professionnelle
      { wch: 15 }, // Niveau d'études
      { wch: 20 }, // Spécialité
      { wch: 20 }, // Établissement
      { wch: 15 }, // Confirmation appel
      { wch: 15 }, // Confirmation email
      { wch: 15 }, // Évaluation soumise
      { wch: 20 }, // Date d'inscription
      { wch: 10 }, // Liste noire
      { wch: 10 }  // Saturé
    ];
    worksheet['!cols'] = colWidths;
    
    // Sécurisation du nom de la formation pour le nom de fichier
    const sanitizedFormationName = formation.nom
      .replace(/[^a-z0-9]/gi, '_')
      .toLowerCase()
      .substring(0, 30); // Limiter la longueur
    
    // Ajout de la feuille au classeur
    XLSX.utils.book_append_sheet(workbook, worksheet, "Beneficiaires");
    
    // Création du répertoire temporaire s'il n'existe pas
    const uploadsDir = path.join(__dirname, "..", "uploads", "temp");
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    
    // Génération du nom de fichier avec horodatage
    const timestamp = Date.now();
    const fileName = `beneficiaires_${sanitizedFormationName}_${timestamp}.xlsx`;
    const filePath = path.join(uploadsDir, fileName);
    
    // Écriture du fichier
    XLSX.writeFile(workbook, filePath);
    
    // Configuration des en-têtes pour le téléchargement
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);
    
    // Envoi du fichier au client
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
    
    // Suppression du fichier après envoi
    fileStream.on('end', () => {
      fs.unlinkSync(filePath);
    });
    
    // Journalisation de l'activité
    console.log(`[${new Date().toISOString()}] Export de ${excelData.length} bénéficiaires pour la formation ${formation.nom} (ID: ${formationId})`);
    
  } catch (error) {
    console.error(`[${new Date().toISOString()}] Erreur lors de l'export des bénéficiaires:`, error);
    
    return res.status(500).json({
      success: false,
      message: "Erreur lors de l'export des bénéficiaires",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

const getBeneficiairesWithPresence = async (req, res) => {
  try {
     const formationId = req.params.formationId;
    console.log("ID Formation reçu :", formationId); // Ajoute cette ligne pour vérifier l'ID
    if (!mongoose.Types.ObjectId.isValid(formationId)) {
      return res.status(400).json({ message: "ID de formation invalide" });
    }
    // Étape 1 : Récupérer les bénéficiaires associés à la formation
    const beneficiairesFormation = await getBeneficiairesByFormation(formationId);
    console.log("Bénéficiaires Formation:", beneficiairesFormation);
    const beneficiairesFormationIds = beneficiairesFormation.map(bf => bf._id);
    
    // Étape 2 : Récupérer les présences associées
    const presences = await getPresencesByBeneficiaires(beneficiairesFormationIds);
    
    // Étape 3 : Construire la réponse
    const result = await Promise.all(beneficiairesFormation.map(async (bf) => {
    const autresFormations = await getOtherFormationsByBeneficiaire(bf.beneficiaire._id, formationId);
      
      return {
        beneficiaireFormationId: bf._id,
        beneficiaire: bf.beneficiaire,
        formationId: bf.formation,
        presences: presences.filter(p => p.beneficiareFormation.toString() === bf._id.toString()),
        autresFormations: autresFormations.map(f => f.formation),
      };
    }));
    console.log("==== DEBUG BENEF FORMATION PRESENCE ========");
    console.log(result);
    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur lors de la récupération des données." });
  }
};

// export just les bénéficiaire récupérer  a partir du frontend  dans les étapes  : 
const exportBeneficiairesListToExcel = async (req, res) => {
  try {
    const { beneficiaires } = req.body;
    // Validation de la liste en entrée
    if (!beneficiaires || !Array.isArray(beneficiaires) || beneficiaires.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Liste de bénéficiaires invalide ou vide"
      });
    }
    // Préparation des données pour Excel
    const workbook = XLSX.utils.book_new();
    // Formatage des données avec exclusion des champs indésirables
    const excelData = beneficiaires.map(b => {
      const beneficiary = b.beneficiaire;
      // Exclusion des champs __v, createdAt, updatedAt
      const { _id , __v, createdAt, updatedAt, ...cleanBenef } = beneficiary;
      return {
        'Nom': cleanBenef.nom || '',
        'Prénom': cleanBenef.prenom || '',
        'Email': cleanBenef.email || '',
        'Téléphone': cleanBenef.telephone || '',
        'Genre': cleanBenef.genre || '',
        'Pays': cleanBenef.pays || '',
        'Spécialité': cleanBenef.specialite || '',
        'Établissement': cleanBenef.etablissement || '',
        'Profession': cleanBenef.profession || '',
        'Région': cleanBenef.region || '',
        'Catégorie d\'âge': cleanBenef.categorieAge || '',
        'Liste noire': cleanBenef.isBlack ? 'Oui' : 'Non',
        'Saturé': cleanBenef.isSaturate ? 'Oui' : 'Non'
      };
    });
    // Création de la feuille de calcul
    const worksheet = XLSX.utils.json_to_sheet(excelData);
    // Configuration des largeurs de colonnes
    const colWidths = [
      { wch: 15 }, // Nom
      { wch: 15 }, // Prénom
      { wch: 25 }, // Email
      { wch: 15 }, // Téléphone
      { wch: 10 }, // Genre
      { wch: 15 }, // Pays
      { wch: 20 }, // Spécialité
      { wch: 20 }, // Établissement
      { wch: 20 }, // Profession
      { wch: 15 }, // Région
      { wch: 15 }, // Catégorie d'âge
      { wch: 12 }, // Liste noire
      { wch: 12 }  // Saturé
    ];
    worksheet['!cols'] = colWidths;
    // Ajout de la feuille au classeur
    XLSX.utils.book_append_sheet(workbook, worksheet, "Beneficiaires");
    // Génération du nom de fichier
    const timestamp = Date.now();
    const fileName = `beneficiaires_export_${timestamp}.xlsx`;
    // Configuration de la réponse HTTP
    res.setHeader('Content-Type', 
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 
      `attachment; filename="${fileName}"`);
    // Création d'un buffer et envoi direct
    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
    res.end(buffer);
    // Journalisation
    console.log(`[${new Date().toISOString()}] Export de ${beneficiaires.length} bénéficiaires`);
  } catch (error) {
    console.error(`[${new Date().toISOString()}] Erreur lors de l'export :`, error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la génération du fichier Excel",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
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
    getNombreBeneficiairesParFormateur,
    updateBeneficiaireConfirmations,
    exportBeneficiairesToExcel,
    getBeneficiairesWithPresence,
    exportBeneficiairesListToExcel
};