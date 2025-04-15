const EDC = require('../Models/edc.model');
const { Entity } = require('../Models/entity.model');
const Formation = require('../Models/formation.model');
const BeneficiareFormation = require('../Models/beneficiairesFormation');
const mongoose = require('mongoose');
const { 
    getAllFormateursEdc, 
    getAllFormationsEdc, 
    getAllBeneficiairesFormationsEdc,
} = require('../utils/edcUtils');

// Create a new EDC entity
const createEDC = async (req, res) => {
  try {
    const { ville } = req.body;

    // Validate required fields
    if (!ville) {
      return res.status(400).json({ message: "Ville is required" });
    }

    // Check if an entity with this ville already exists
    const existingEntity = await Entity.findOne({ ville });
    
    if (existingEntity) {
      return res.status(409).json({ 
        message: "Une entité avec cette ville existe déjà",
        existingEntity 
      });
    }

    // First, create the base Entity
    const entity = new Entity({
      ville,
      type: "EDC" // Set the type as EDC
    });

    await entity.save();

    // Then create the EDC with reference to the base entity
    const newEDC = new EDC({
      entity: entity._id,
    });

    await newEDC.save();

    res.status(201).json({
      message: "EDC created successfully",
      edc: {
        ...newEDC._doc,
        entity: entity
      }
    });
  } catch (error) {
    console.error("Error creating EDC:", error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: "Validation error", errors: error.errors });
    }
    res.status(500).json({ message: "Error creating EDC", error: error.message });
  }
};

// Get all EDC entities with their related Entity info
const getAllEDCs = async (req, res) => {
  try {
    const edcs = await EDC.find().populate('entity').sort({ createdAt: -1 });

    res.status(200).json(edcs);
  } catch (error) {
    console.error("Error fetching EDCs:", error);
    res.status(500).json({ message: "Error fetching EDCs", error: error.message });
  }
};

// Get a single EDC by ID
const getEDCById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }

    const edc = await EDC.findById(id).populate('entity');

    if (!edc) {
      return res.status(404).json({ message: "EDC not found" });
    }

    res.status(200).json(edc);
  } catch (error) {
    console.error("Error fetching EDC:", error);
    res.status(500).json({ message: "Error fetching EDC", error: error.message });
  }
};

// Delete an EDC and its related Entity
const deleteEDC = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }

    // Find the EDC to get the Entity reference
    const edc = await EDC.findById(id);
    if (!edc) {
      return res.status(404).json({ message: "EDC not found" });
    }

    // Delete the EDC
    await EDC.findByIdAndDelete(id);

    // Delete the associated Entity
    await Entity.findByIdAndDelete(edc.entity);

    res.status(200).json({ message: "EDC deleted successfully" });
  } catch (error) {
    console.error("Error deleting EDC:", error);
    res.status(500).json({ message: "Error deleting EDC", error: error.message });
  }
};

const getFormateursEdc = async (req, res) => {
  try {
    // Fetch all EDCs from the database
      const allEdcs = await EDC.find({}).select('_id');
      
      // Extract EDC IDs into an array
      const edcIdArray = allEdcs.map(edc => edc._id.toString());
      
      // Check if we found any EDCs
      if (edcIdArray.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Aucun EDC trouvé dans la base de données"
        });
      }

      // Récupérer les formateurs pour chaque EDC
      const formateurs = await getAllFormateursEdc(edcIdArray);

      res.status(200).json({
          success: true,
          count: formateurs.length,
          data: formateurs
      });
  } catch (error) {
      res.status(500).json({
          success: false,
          message: error.message
      });
  }
};

const getNbrBeneficiairesByFormation = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Vérifier que la formation existe
    const formation = await Formation.findById(id);
    if (!formation) {
      return res.status(404).json({
        success: false,
        message: "Formation non trouvée"
      });
    }
    
    // Compter le nombre total de bénéficiaires pour cette formation
    const totalCount = await BeneficiareFormation.countDocuments({ formation: id });
    
    // Compter les bénéficiaires ayant confirmé par appel ET par email
    const confirmedCount = await BeneficiareFormation.countDocuments({ 
      formation: id, 
      confirmationAppel: true,
      confirmationEmail: true 
    });
    
    res.status(200).json({
      success: true,
      count: totalCount,
      confirmedCount: confirmedCount,
      data: {
        id: formation._id,
        nom: formation.nom,
        dateDebut: formation.dateDebut,
        dateFin: formation.dateFin
      }
    });
  } catch (error) {
    console.error("Erreur lors de la récupération du nombre de bénéficiaires par formation:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


const getFormationsEdc = async (req, res) => {
  try {
    // Fetch all EDCs from the database
      const allEdcs = await EDC.find({}).select('_id');
      
      // Extract EDC IDs into an array
      const edcIdArray = allEdcs.map(edc => edc._id.toString());
      
      // Check if we found any EDCs
      if (edcIdArray.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Aucun EDC trouvé dans la base de données"
        });
      }

      // Récupérer les formateurs pour chaque EDC
      const formateurs = await getAllFormateursEdc(edcIdArray);

      // Récupérer les formations pour ces formateurs
      const formations = await getAllFormationsEdc(formateurs);

      res.status(200).json({
          success: true,
          count: formations.length,
          data: formations
      });
  } catch (error) {
      res.status(500).json({
          success: false,
          message: error.message
      });
  }
};

const getBeneficiairesEdc = async (req, res) => {
  try {
    // Fetch all EDCs from the database
      const allEdcs = await EDC.find({}).select('_id');
      
      // Extract EDC IDs into an array
      const edcIdArray = allEdcs.map(edc => edc._id.toString());
      
      // Check if we found any EDCs
      if (edcIdArray.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Aucun EDC trouvé dans la base de données"
        });
      }

      // Récupérer les formateurs pour chaque EDC
      const formateurs = await getAllFormateursEdc(edcIdArray);

      // Récupérer les formations pour ces formateurs
      const formations = await getAllFormationsEdc(formateurs);

      // Récupérer les bénéficiaires pour ces formations
      const beneficiaires = await getAllBeneficiairesFormationsEdc(formations);

      res.status(200).json({
          success: true,
          count: beneficiaires.length,
          data: beneficiaires
      });
  } catch (error) {
      res.status(500).json({
          success: false,
          message: error.message
      });
  }
};

module.exports = {
  createEDC,
  getAllEDCs,
  getEDCById,
  deleteEDC,
  getFormateursEdc,
  getFormationsEdc,
  getBeneficiairesEdc,
  getNbrBeneficiairesByFormation
};