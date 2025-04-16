const Formation = require('../Models/formation.model');
const FormationDraft = require('../Models/formationDraft.model');
const Formateur=require("../Models/formateur.model");
const { determineFormationStatus } = require('../utils/formationUtils.js')
const mongoose = require('mongoose');
const {creerPresencesBeneficiaires } = require("../utils/BeneficiairePresence.js")
// Récupérer les informations d'une FormationDraft par l'ID de formation
const getFormationStep = async (req, res) => {
  try {
    const formationId = req.params.formationId;
    
    if (!formationId) {
      return res.status(400).json({ message: "ID de formation requis" });
    }
    
    // Trouver le FormationDraft lié à cette formation
    const formationDraft = await FormationDraft.findOne({ formation: formationId }).populate('formation');
    
    if (!formationDraft) {
      return res.status(404).json({ message: "Aucun brouillon de formation trouvé pour cette formation" });
    }
    
    res.status(200).json({
      success: true,
      formationDraft
    });
    
  } catch (error) {
    console.error("Erreur lors de la récupération du brouillon de formation:", error);
    res.status(500).json({
      message: "Erreur lors de la récupération du brouillon de formation",
      error: error.message
    });
  }
};

// Incrémenter le currentStep et mettre à jour isDraft
const updateFormationStep = async (req, res) => {
  try {
    const formationId = req.params.formationId;
    
    if (!formationId) {
      return res.status(400).json({ message: "ID de formation requis" });
    }
    
    // Trouver le FormationDraft lié à cette formation
    const formationDraft = await FormationDraft.findOne({ formation: formationId });
    
    if (!formationDraft) {
      return res.status(404).json({ message: "Aucun brouillon de formation trouvé pour cette formation" });
    }
    
    // Incrémenter currentStep
    formationDraft.currentStep += 1;
    
    // Si currentStep atteint 3, mettre isDraft à false
    if (formationDraft.currentStep >= 3) {
      formationDraft.isDraft = false;
    }
    
    // Sauvegarder les modifications
    await formationDraft.save();
    
    res.status(200).json({
      success: true,
      message: "Étape de formation mise à jour avec succès",
      formationDraft
    });
    
  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'étape de formation:", error);
    res.status(500).json({
      message: "Erreur lors de la mise à jour de l'étape de formation",
      error: error.message
    });
  }
};
const createFormationDraft = async (req, res) => {
    try {
      // 1. Vérification de l'authentification
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({ message: "Utilisateur non authentifié" });
      }
  
      // 2. Vérification du formateur
      const formateur = await Formateur.findOne({ utilisateur: userId });
      if (!formateur) {
        return res.status(404).json({ message: "Formateur non trouvé" }); // 404 au lieu de 401
      }
  
      // 3. Validation des données
      const { 
        nom,
        currentStep, // Extraction de currentStep
        dateDebut,
        dateFin
      } = req.body;
  
      if (!nom) {
        return res.status(400).json({ 
          message: "Le nom de la formation est obligatoire" 
        });
      } else if(!dateDebut || !dateFin) {
        return res.status(400).json({message: "date debut et date fin de formation est obligatoire"})
      }
  
      // 4. Gestion de currentStep avec valeur par défaut
      const safeCurrentStep = typeof currentStep === 'number' 
        ? Math.max(1, Math.min(currentStep, 4))
        : 2; // Valeur par défaut
  
      // 5. Création de la formation
      const nouvelleFormation = new Formation({
        ...req.body,
        formateur: formateur._id,
        image: req.file?.path || null,
        status: determineFormationStatus(dateDebut, dateFin)
      });
  
      // 6. Création du brouillon avec transaction
      const session = await mongoose.startSession();
      session.startTransaction();
  
      try {
        const formationEnregistree = await nouvelleFormation.save({ session });
  
        const nouveauFormationDraft = new FormationDraft({
          formation: formationEnregistree._id,
          isDraft: true,
          currentStep: safeCurrentStep
        });
  
        const draftEnregistre = await nouveauFormationDraft.save({ session });
  
        await session.commitTransaction();
        session.endSession();
  
        res.status(201).json({
          message: "Brouillon créé avec succès",
          data: {
            ...formationEnregistree.toObject(),
            draft: draftEnregistre.toObject()
          }
        });
  
      } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error;
      }
  
    } catch (error) {
      console.error("Erreur création brouillon:", error);
      const statusCode = error.name === 'ValidationError' ? 400 : 500;
      res.status(statusCode).json({ 
        message: error.message || "Erreur lors de la création du brouillon",
        details: error.errors 
      });
    }
  };

  const getAllFormationsWithDraftStatus = async (req, res) => {
    try {
      // 1. Get user ID from authentication
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({ message: "Utilisateur non authentifié" });
      }
      
      // 2. Find the formateur associated with this user
      const formateur = await Formateur.findOne({ utilisateur: userId });
      if (!formateur) {
        return res.status(404).json({ message: "Formateur non trouvé" });
      }
      
      // 3. Fetch all formations of this formateur
      const formations = await Formation.find({ formateur: formateur._id });
      
      // 4. Fetch all draft information for these formations
      const formationIds = formations.map(formation => formation._id);
      const formationDrafts = await FormationDraft.find({
        formation: { $in: formationIds }
      });
      
      // 5. Create a map of draft information by formation ID
      const draftsMap = {};
      formationDrafts.forEach(draft => {
        draftsMap[draft.formation.toString()] = {
          isDraft: draft.isDraft,
          currentStep: draft.currentStep
        };
      });
      
      // 6. Get current date for status calculation
      const now = new Date();
      
      // 7. Merge formation data with draft information and calculate real-time status
      const formationsCompletes = formations.map(formation => {
        const formationObj = formation.toObject();
        
        // Add image conversion if necessary
        if (formation.image && formation.imageType) {
          formationObj.image = `data:${formation.imageType};base64,${formation.image.toString("base64")}`;
        }
        
        // Calculate dynamic status based on dates
        const dateDebut = formation.dateDebut ? new Date(formation.dateDebut) : null;
        const dateFin = formation.dateFin ? new Date(formation.dateFin) : null;
        
        // Store original database status
        formationObj.dbStatus = formation.status;
        
        // Calculate real-time status
        if (dateFin && now > dateFin) {
          formationObj.status = "Terminé";
        } else if (dateDebut && now >= dateDebut && (!dateFin || now <= dateFin)) {
          formationObj.status = "En Cours";
        } else if (dateDebut && now < dateDebut) {
          formationObj.status = "Avenir";
        }
        // If dates are missing, keep the original status
        
        // Add draft information if it exists
        const draftInfo = draftsMap[formation._id.toString()];
        if (draftInfo) {
          formationObj.isDraft = draftInfo.isDraft;
          formationObj.currentStep = draftInfo.currentStep;
        } else {
          // Default values if no draft exists
          formationObj.isDraft = false;
          formationObj.currentStep = null;
        }
        
        return formationObj;
      });
      
      // 8. Return complete formations
      res.status(200).json(formationsCompletes);
    } catch (error) {
      console.error("Error fetching formations with draft status:", error);
      res.status(500).json({
        message: "Erreur lors de la récupération des formations",
        error: error.message
      });
    }
  };

  const validerFormation = async (req, res) => {
    try {
      const { formationId } = req.params;
  
      // Validate if formationId is provided
      if (!formationId) {
        return res.status(400).json({
          success: false,
          message: "L'ID de formation est requis"
        });
      }
  
      // Find the FormationDraft by formation ID and update isDraft to false
      const updatedDraft = await FormationDraft.findOneAndUpdate(
        { formation: formationId },
        { isDraft: false },
        { new: true } // Return the updated document
      );
  
      // Check if draft was found
      if (!updatedDraft) {
        return res.status(404).json({
          success: false,
          message: "Aucun brouillon de formation trouvé pour cet ID"
        });
      }
      const resultatPresences = await creerPresencesBeneficiaires(formationId);

      return res.status(200).json({
        success: true,
        message: "Formation validée avec succès",
        data: updatedDraft,
        resultatsPresences: resultatPresences.success ? resultatPresences.resultats : null,
        erreurPresences: !resultatPresences.success ? resultatPresences.error : null
      });
    } catch (error) {
      console.error("Erreur lors de la validation de la formation:", error);
      return res.status(500).json({
        success: false,
        message: "Une erreur est survenue lors de la validation de la formation",
        error: error.message
      });
    }
  };
module.exports = {
  validerFormation, 
  getFormationStep,
  updateFormationStep,
  createFormationDraft,
  getAllFormationsWithDraftStatus

};