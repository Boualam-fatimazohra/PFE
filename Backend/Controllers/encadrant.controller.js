const Encadrant = require('../Models/encadrant.model');
const { Utilisateur } = require('../Models/utilisateur.model');
const mongoose = require('mongoose');

/**
 * Create a new encadrant with a new utilisateur
 */
const createEncadrant = async (req, res) => {
  try {
    const { 
      nom, 
      prenom, 
      email, 
      numeroTelephone, 
      password, 
      type, 
      specialite, 
      disponibilite 
    } = req.body;

    // Validate required fields
    if (!nom || !prenom || !email || !password || !type) {
      return res.status(400).json({ 
        message: "nom, prenom, email, password, and type are required" 
      });
    }

    // Verify valid type
    if (!['Interne', 'Externe'].includes(type)) {
      return res.status(400).json({ 
        message: "type must be either 'Interne' or 'Externe'" 
      });
    }

    // Check if email already exists
    const existingUser = await Utilisateur.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ 
        message: "Un utilisateur avec cet email existe déjà" 
      });
    }

    // Hash password
    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new utilisateur
    const newUtilisateur = new Utilisateur({
      nom,
      prenom,
      email,
      numeroTelephone,
      password: hashedPassword,
      role: "Encadrant" // Adding Encadrant as a role
    });

    // Save the utilisateur first
    await newUtilisateur.save();

    // Create new encadrant linked to the new utilisateur
    const newEncadrant = new Encadrant({
      utilisateur: newUtilisateur._id,
      type,
      specialite,
      disponibilite
    });

    // Save the encadrant
    await newEncadrant.save();

    // Return the created encadrant with populated utilisateur details
    const populatedEncadrant = await Encadrant.findById(newEncadrant._id)
      .populate('utilisateur', 'nom prenom email numeroTelephone');

    res.status(201).json({
      message: "Encadrant créé avec succès",
      encadrant: populatedEncadrant
    });
  } catch (error) {
    console.error("Erreur création encadrant:", error);
    
    // If utilisateur was created but encadrant creation failed, clean up
    if (error.utilisateurId) {
      await Utilisateur.findByIdAndDelete(error.utilisateurId);
    }
    
    res.status(500).json({ 
      message: "Erreur lors de la création de l'encadrant", 
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