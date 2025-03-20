const EDC = require('../Models/edc.model');
const { Entity } = require('../Models/entity.model');
const mongoose = require('mongoose');
const { 
    getAllFormateursEdc, 
    getAllFormationsEdc, 
    getAllBeneficiairesFormationsEdc 
} = require('../utils/edcUtils');

// Create a new EDC entity
const createEDC = async (req, res) => {
  try {
    const { ville } = req.body;

    // Validate required fields
    if (!ville) {
      return res.status(400).json({ message: "Ville are required" });
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

// Update an EDC
/*const updateEDC = async (req, res) => {
  try {
    const { id } = req.params;
    const { ville, specialite, nombreFormateurs, certifications, responsable, domaineFormation } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }

    // Find the EDC first
    const edc = await EDC.findById(id);
    if (!edc) {
      return res.status(404).json({ message: "EDC not found" });
    }

    // Create update objects for both EDC and Entity
    const edcUpdateData = {};
    if (specialite) edcUpdateData.specialite = specialite;
    if (nombreFormateurs !== undefined) edcUpdateData.nombreFormateurs = nombreFormateurs;
    if (certifications) edcUpdateData.certifications = certifications;
    if (responsable) edcUpdateData.responsable = responsable;
    if (domaineFormation) edcUpdateData.domaineFormation = domaineFormation;

    // Update the EDC
    const updatedEDC = await EDC.findByIdAndUpdate(
      id,
      edcUpdateData,
      { new: true, runValidators: true }
    );

    // If ville is provided, update the related Entity
    if (ville) {
      await Entity.findByIdAndUpdate(
        edc.entity,
        { ville },
        { runValidators: true }
      );
    }

    // Fetch the complete updated EDC with Entity data
    const completeUpdatedEDC = await EDC.findById(id).populate('entity');

    res.status(200).json({
      message: "EDC updated successfully",
      edc: completeUpdatedEDC
    });
  } catch (error) {
    console.error("Error updating EDC:", error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: "Validation error", errors: error.errors });
    }
    res.status(500).json({ message: "Error updating EDC", error: error.message });
  }
};*/

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
      // Récupérer les edcIds depuis les paramètres d'URL
      const { edcIds } = req.params;

      // Vérifier si edcIds est présent
      if (!edcIds) {
          return res.status(400).json({
              success: false,
              message: "La liste des EDC IDs est requise"
          });
      }

      // Convertir la chaîne de caractères en tableau
      const edcIdArray = edcIds.split(',');

      // Vérifier si edcIdArray est un tableau non vide
      if (!Array.isArray(edcIdArray) || edcIdArray.length === 0) {
          return res.status(400).json({
              success: false,
              message: "La liste des EDC IDs est invalide"
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

const getFormationsEdc = async (req, res) => {
  try {
      // Récupérer les edcIds depuis les paramètres d'URL
      const { edcIds } = req.params;

      // Vérifier si edcIds est présent
      if (!edcIds) {
          return res.status(400).json({
              success: false,
              message: "La liste des EDC IDs est requise"
          });
      }

      // Convertir la chaîne de caractères en tableau
      const edcIdArray = edcIds.split(',');

      // Vérifier si edcIdArray est un tableau non vide
      if (!Array.isArray(edcIdArray) || edcIdArray.length === 0) {
          return res.status(400).json({
              success: false,
              message: "La liste des EDC IDs est invalide"
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
      // Récupérer les edcIds depuis les paramètres d'URL
      const { edcIds } = req.params;

      // Vérifier si edcIds est présent
      if (!edcIds) {
          return res.status(400).json({
              success: false,
              message: "La liste des EDC IDs est requise"
          });
      }

      // Convertir la chaîne de caractères en tableau
      const edcIdArray = edcIds.split(',');

      // Vérifier si edcIdArray est un tableau non vide
      if (!Array.isArray(edcIdArray) || edcIdArray.length === 0) {
          return res.status(400).json({
              success: false,
              message: "La liste des EDC IDs est invalide"
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
  getBeneficiairesEdc
};