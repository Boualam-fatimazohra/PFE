const Encadrant = require('../Models/encadrant.model');
const { Entity } = require('../Models/entity.model');
const { Utilisateur } = require('../Models/utilisateur.model');
const { UtilisateurEntity } = require('../Models/utilisateurEntity');
const mongoose = require('mongoose');

/**
 * Create a new encadrant with a new utilisateur
 */
const createEncadrant = async (req, res) => {
  // Start a session for the transaction
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const {
      nom,
      prenom,
      email,
      numeroTelephone,
      password,
      type,
      specialite,
      disponibilite,
      entityId
    } = req.body;

    // Validate required fields
    if (!nom || !prenom || !email || !type) {
      return res.status(400).json({
        message: "nom, prenom, email, and type are required"
      });
    }

    // Verify valid type
    if (!['Interne', 'Externe'].includes(type)) {
      return res.status(400).json({
        message: "type must be either 'Interne' or 'Externe'"
      });
    }

    // Validate entityId if provided
    if (entityId && !mongoose.Types.ObjectId.isValid(entityId)) {
      return res.status(400).json({
        message: "Invalid entityId format"
      });
    }

    // Check if entity exists if entityId is provided
    if (entityId) {
      const entityExists = await Entity.findById(entityId).session(session);
      if (!entityExists) {
        await session.abortTransaction();
        session.endSession();
        return res.status(404).json({
          message: "Entity not found"
        });
      }
    }

    // IDEMPOTENCY: Check if utilisateur with this email already exists
    let utilisateur = await Utilisateur.findOne({ email }).session(session);
    let isNewUser = false;
    
    if (!utilisateur) {
      // Only hash password if we need to create a new user
      const bcrypt = require('bcryptjs');
      const hashedPassword = await bcrypt.hash(password, 10);
      
      // Create new utilisateur
      utilisateur = new Utilisateur({
        nom,
        prenom,
        email,
        numeroTelephone,
        password: hashedPassword,
        role: "Encadrant"
      });
      
      await utilisateur.save({ session });
      isNewUser = true;
    } else if (utilisateur.role !== "Encadrant") {
      // If user exists but isn't an Encadrant, abort
      await session.abortTransaction();
      session.endSession();
      return res.status(409).json({
        message: "Un utilisateur avec cet email existe déjà avec un rôle différent"
      });
    }

    // IDEMPOTENCY: Check if encadrant already exists for this utilisateur
    let encadrant = await Encadrant.findOne({ utilisateur: utilisateur._id }).session(session);
    let isNewEncadrant = false;
    
    if (!encadrant) {
      // Create new encadrant linked to the utilisateur
      encadrant = new Encadrant({
        utilisateur: utilisateur._id,
        type,
        specialite,
        disponibilite
      });
      
      await encadrant.save({ session });
      isNewEncadrant = true;
    } else {
      // If requested data differs from existing, update the encadrant
      if (encadrant.type !== type || 
          encadrant.specialite !== specialite || 
          encadrant.disponibilite !== disponibilite) {
        
        encadrant.type = type;
        encadrant.specialite = specialite;
        encadrant.disponibilite = disponibilite;
        await encadrant.save({ session });
      }
    }

    // IDEMPOTENCY: Handle entity relationship
    if (entityId) {
      // Check if the relationship already exists
      const existingRelation = await UtilisateurEntity.findOne({
        id_utilisateur: utilisateur._id,
        id_entity: entityId
      }).session(session);
      
      if (!existingRelation) {
        const newUtilisateurEntity = new UtilisateurEntity({
          id_utilisateur: utilisateur._id,
          id_entity: entityId,
          date: new Date()
        });
        
        await newUtilisateurEntity.save({ session });
      }
    }

    // Commit the transaction
    await session.commitTransaction();
    session.endSession();

    // Return the encadrant with populated utilisateur details
    const populatedEncadrant = await Encadrant.findById(encadrant._id)
      .populate('utilisateur', 'nom prenom email numeroTelephone');

    // Return appropriate status code based on whether we created or found existing
    const statusCode = (isNewUser || isNewEncadrant) ? 201 : 200;
    
    res.status(statusCode).json({
      message: isNewEncadrant 
        ? "Encadrant créé avec succès" 
        : "Encadrant existant récupéré ou mis à jour",
      encadrant: populatedEncadrant,
      entityAssigned: entityId ? true : false,
      isNewRecord: isNewEncadrant
    });
  } catch (error) {
    // If any error occurs, abort the transaction
    await session.abortTransaction();
    session.endSession();

    console.error("Erreur création/récupération encadrant:", error);
    res.status(500).json({
      message: "Erreur lors de la création ou récupération de l'encadrant",
      error: error.message
    });
  }
};

/**
 * Get all encadrants
 */
const getAllEncadrants = async (req, res) => {
  try {
    const encadrants = await Encadrant.find()
      .populate('utilisateur', 'nom prenom email numeroTelephone')
      .sort({ createdAt: -1 });

    res.status(200).json(encadrants);
  } catch (error) {
    console.error("Error fetching encadrants:", error);
    res.status(500).json({ 
      message: "Error fetching encadrants", 
      error: error.message 
    });
  }
};

/**
 * Get encadrant by ID
 */
const getEncadrantById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }

    const encadrant = await Encadrant.findById(id)
      .populate('utilisateur', 'nom prenom email numeroTelephone');

    if (!encadrant) {
      return res.status(404).json({ message: "Encadrant not found" });
    }

    res.status(200).json(encadrant);
  } catch (error) {
    console.error("Error fetching encadrant:", error);
    res.status(500).json({ 
      message: "Error fetching encadrant", 
      error: error.message 
    });
  }
};

/**
 * Update encadrant
 */
const updateEncadrant = async (req, res) => {
  try {
    const { id } = req.params;
    const { type, specialite, disponibilite } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }

    // Find the encadrant first to check if it exists
    const encadrant = await Encadrant.findById(id);
    if (!encadrant) {
      return res.status(404).json({ message: "Encadrant not found" });
    }

    // Prepare update data
    const updateData = {};
    
    if (type) {
      if (!['Interne', 'Externe'].includes(type)) {
        return res.status(400).json({ message: "type must be either 'Interne' or 'Externe'" });
      }
      updateData.type = type;
    }
    
    if (specialite !== undefined) updateData.specialite = specialite;
    if (disponibilite !== undefined) updateData.disponibilite = disponibilite;

    // Update the encadrant
    const updatedEncadrant = await Encadrant.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate('utilisateur', 'nom prenom email numeroTelephone');

    res.status(200).json({
      message: "Encadrant updated successfully",
      encadrant: updatedEncadrant
    });
  } catch (error) {
    console.error("Error updating encadrant:", error);
    res.status(500).json({ 
      message: "Error updating encadrant", 
      error: error.message 
    });
  }
};

/**
 * Delete encadrant
 */
const deleteEncadrant = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }

    // Find and delete the encadrant
    const deletedEncadrant = await Encadrant.findByIdAndDelete(id);

    if (!deletedEncadrant) {
      return res.status(404).json({ message: "Encadrant not found" });
    }

    res.status(200).json({
      message: "Encadrant deleted successfully",
      encadrant: deletedEncadrant
    });
  } catch (error) {
    console.error("Error deleting encadrant:", error);
    res.status(500).json({ 
      message: "Error deleting encadrant", 
      error: error.message 
    });
  }
};

module.exports = {
  createEncadrant,
  getAllEncadrants,
  getEncadrantById,
  updateEncadrant,
  deleteEncadrant
};