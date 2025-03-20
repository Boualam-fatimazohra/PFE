const { UtilisateurEntity } = require('../Models/utilisateurEntity');
const { Utilisateur } = require('../Models/utilisateur.model');
const { Entity } = require('../Models/entity.model');
const mongoose = require('mongoose');

// Create a new association between a User and an Entity
const createUtilisateurEntity = async (req, res) => {
  try {
    const { id_utilisateur, id_entity } = req.body;

    // Validate required fields
    if (!id_utilisateur || !id_entity) {
      return res.status(400).json({ message: "User ID and Entity ID are required" });
    }

    // Validate IDs format
    if (!mongoose.Types.ObjectId.isValid(id_utilisateur) || !mongoose.Types.ObjectId.isValid(id_entity)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }

    // Check if user exists
    const userExists = await Utilisateur.findById(id_utilisateur);
    if (!userExists) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if entity exists
    const entityExists = await Entity.findById(id_entity);
    if (!entityExists) {
      return res.status(404).json({ message: "Entity not found" });
    }

    // Check if association already exists
    const existingAssociation = await UtilisateurEntity.findOne({
      id_utilisateur,
      id_entity
    });

    if (existingAssociation) {
      return res.status(409).json({ message: "Association already exists" });
    }

    // Create new association
    const newUtilisateurEntity = new UtilisateurEntity({
      id_utilisateur,
      id_entity
    });

    await newUtilisateurEntity.save();

    res.status(201).json({
      message: "Association created successfully",
      utilisateurEntity: newUtilisateurEntity
    });
  } catch (error) {
    console.error("Error creating association:", error);
    res.status(500).json({ message: "Error creating association", error: error.message });
  }
};

// Get all User-Entity associations
const getAllUtilisateurEntities = async (req, res) => {
  try {
    const utilisateurEntities = await UtilisateurEntity.find()
      .populate("id_utilisateur", "nom prenom email role")
      .populate("id_entity", "ville type");

    res.status(200).json(utilisateurEntities);
  } catch (error) {
    console.error("Error fetching associations:", error);
    res.status(500).json({ message: "Error fetching associations", error: error.message });
  }
};

// Get associations by User ID
const getEntitiesByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID format" });
    }

    const utilisateurEntities = await UtilisateurEntity.find({ id_utilisateur: userId })
      .populate("id_entity", "ville type");

    if (utilisateurEntities.length === 0) {
      return res.status(404).json({ message: "No entities found for this user" });
    }

    res.status(200).json(utilisateurEntities);
  } catch (error) {
    console.error("Error fetching user entities:", error);
    res.status(500).json({ message: "Error fetching user entities", error: error.message });
  }
};

// Get associations by Entity ID
const getUsersByEntity = async (req, res) => {
  try {
    const { entityId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(entityId)) {
      return res.status(400).json({ message: "Invalid entity ID format" });
    }

    const utilisateurEntities = await UtilisateurEntity.find({ id_entity: entityId })
      .populate("id_utilisateur", "nom prenom email role");

    if (utilisateurEntities.length === 0) {
      return res.status(404).json({ message: "No users found for this entity" });
    }

    res.status(200).json(utilisateurEntities);
  } catch (error) {
    console.error("Error fetching entity users:", error);
    res.status(500).json({ message: "Error fetching entity users", error: error.message });
  }
};

// Get a single User-Entity association by ID
const getUtilisateurEntityById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }

    const utilisateurEntity = await UtilisateurEntity.findById(id)
      .populate("id_utilisateur", "nom prenom email role")
      .populate("id_entity", "ville type");

    if (!utilisateurEntity) {
      return res.status(404).json({ message: "Association not found" });
    }

    res.status(200).json(utilisateurEntity);
  } catch (error) {
    console.error("Error fetching association:", error);
    res.status(500).json({ message: "Error fetching association", error: error.message });
  }
};

// Update a User-Entity association
const updateUtilisateurEntity = async (req, res) => {
  try {
    const { id } = req.params;
    const { id_utilisateur, id_entity } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }

    // Validate input data
    if (id_utilisateur && !mongoose.Types.ObjectId.isValid(id_utilisateur)) {
      return res.status(400).json({ message: "Invalid user ID format" });
    }

    if (id_entity && !mongoose.Types.ObjectId.isValid(id_entity)) {
      return res.status(400).json({ message: "Invalid entity ID format" });
    }

    // Check if user exists (if user ID is being updated)
    if (id_utilisateur) {
      const userExists = await Utilisateur.findById(id_utilisateur);
      if (!userExists) {
        return res.status(404).json({ message: "User not found" });
      }
    }

    // Check if entity exists (if entity ID is being updated)
    if (id_entity) {
      const entityExists = await Entity.findById(id_entity);
      if (!entityExists) {
        return res.status(404).json({ message: "Entity not found" });
      }
    }

    // Prepare update object with only defined fields
    const updateData = {};
    if (id_utilisateur) updateData.id_utilisateur = id_utilisateur;
    if (id_entity) updateData.id_entity = id_entity;

    // Update the association
    const updatedUtilisateurEntity = await UtilisateurEntity.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    )
      .populate("id_utilisateur", "nom prenom email role")
      .populate("id_entity", "ville type");

    if (!updatedUtilisateurEntity) {
      return res.status(404).json({ message: "Association not found" });
    }

    res.status(200).json({
      message: "Association updated successfully",
      utilisateurEntity: updatedUtilisateurEntity
    });
  } catch (error) {
    console.error("Error updating association:", error);
    res.status(500).json({ message: "Error updating association", error: error.message });
  }
};

// Delete a User-Entity association
const deleteUtilisateurEntity = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }

    const deletedUtilisateurEntity = await UtilisateurEntity.findByIdAndDelete(id);

    if (!deletedUtilisateurEntity) {
      return res.status(404).json({ message: "Association not found" });
    }

    res.status(200).json({ message: "Association deleted successfully" });
  } catch (error) {
    console.error("Error deleting association:", error);
    res.status(500).json({ message: "Error deleting association", error: error.message });
  }
};

module.exports = {
  createUtilisateurEntity,
  getAllUtilisateurEntities,
  getUtilisateurEntityById,
  getEntitiesByUser,
  getUsersByEntity,
  updateUtilisateurEntity,
  deleteUtilisateurEntity
};