const Formation = require('../Models/formation.model.js');
const FormationDraft = require('../Models/formationDraft.model');
const Formateur=require("../Models/formateur.model");
const mongoose = require('mongoose');
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
        currentStep // Extraction de currentStep
      } = req.body;
  
      if (!nom) {
        return res.status(400).json({ 
          message: "Le nom de la formation est obligatoire" 
        });
      }
  
      // 4. Gestion de currentStep avec valeur par défaut
      const safeCurrentStep = typeof currentStep === 'number' 
        ? Math.max(1, Math.min(currentStep, 3)) // Exemple de validation de plage 1-3
        : 2; // Valeur par défaut
  
      // 5. Création de la formation
      const nouvelleFormation = new Formation({
        ...req.body,
        formateur: formateur._id,
        image: req.file?.path || null,
        status: req.body.status || "Avenir"
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
module.exports = {
  getFormationStep,
  updateFormationStep,
  createFormationDraft

};