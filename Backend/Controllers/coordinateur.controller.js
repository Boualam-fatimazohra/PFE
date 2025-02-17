const Manager  = require("../Models/manager.model");
const { Utilisateur } = require("../Models/utilisateur.model");
const Coordinateur = require("../Models/coordinateur.model");

const createCoordinateur = async (req, res) => {
  try {
    const { utilisateurData, manager } = req.body;
    const managerExists = await Manager.findById(manager);
    if (!managerExists) {
      return res.status(404).json({ message: "Manager not found" });
    }

    // Destructure the utilisateur data from the request
    const { firstName, lastName, email, phoneNumber, password, role } = utilisateurData;

    // Check if the role is "Coordinateur"
    if (role !== "Coordinateur") {
      return res.status(400).json({ message: "Utilisateur role must be 'Coordinateur'" });
    }

    // Check if the utilisateur with the same email already exists
    const existingUtilisateur = await Utilisateur.findOne({ email });
    if (existingUtilisateur) {
      return res.status(400).json({ message: "Utilisateur with this email already exists" });
    }

    // Create the utilisateur entry
    const newUtilisateur = new Utilisateur({
      nom,
      prenom,
      email,
      numeroTelephone,
      password,
      role
    });

    // Save the new utilisateur
    await newUtilisateur.save();

    // Create the coordinateur entry with the utilisateur
    const newCoordinateur = new Coordinateur({ utilisateur: newUtilisateur._id, manager });
    await newCoordinateur.save();

    res.status(201).json({
      message: "Coordinateur created successfully",
      coordinateur: newCoordinateur,
      utilisateur: newUtilisateur
    });
  } catch (error) {
    res.status(500).json({ message: "Error creating coordinateur", error: error.message });
  }
};

// Get all Coordinateurs (with Manager details)
const getAllCoordinateurs = async (req, res) => {
  try {
    // Fetch coordinateurs with populated utilisateur (excluding password) and manager
    const coordinateurs = await Coordinateur.find()
      .populate("utilisateur")
      .populate("manager");

    // Check if there are any coordinateurs
    if (!coordinateurs || coordinateurs.length === 0) {
      return res.status(404).json({ message: "No coordinateurs found" });
    }

    // Return coordinateurs
    res.status(200).json(coordinateurs);
  } catch (error) {
    res.status(500).json({ message: "Error fetching coordinateurs", error: error.message });
  }
};


// Get a single Coordinateur by ID (with Manager details)
const getCoordinateurById = async (req, res) => {
  try {
    const coordinateur = await Coordinateur.findById(req.params.id)
      .populate("utilisateur")
      .populate("manager");

    if (!coordinateur) {
      return res.status(404).json({ message: "Coordinateur not found" });
    }

    res.status(200).json(coordinateur);
  } catch (error) {
    res.status(500).json({ message: "Error fetching coordinateur", error: error.message });
  }
};

// Update a Coordinateur
const updateCoordinateur = async (req, res) => {
  try {
    const { nom,prenom, email,numeroTelephone, password } = req.body;

    // Check if Coordinateur exists
    const coordinateur = await Coordinateur.findById(req.params.id);
    if (!coordinateur) {
      return res.status(404).json({ message: "Coordinateur not found" });
    }

    // Update Utilisateur data
    const updatedUtilisateur = await Utilisateur.findByIdAndUpdate(
      coordinateur.utilisateur, 
      { nom,prenom,email,numeroTelephone, password },
      { new: true, runValidators: true }
    );

    if (!updatedUtilisateur) {
      return res.status(500).json({ message: "Error updating utilisateur" });
    }

    // Populate and return updated coordinateur
    const updatedCoordinateur = await Coordinateur.findById(coordinateur._id)
      .populate("utilisateur")
      .populate("manager");

    res.status(200).json(updatedCoordinateur);
  } catch (error) {
    res.status(500).json({ message: "Error updating coordinateur", error: error.message });
  }
};


// Delete a Coordinateur
const deleteCoordinateur = async (req, res) => {
  try {
    const deletedCoordinateur = await Coordinateur.findByIdAndDelete(req.params.id);
    if (!deletedCoordinateur) {
      return res.status(404).json({ message: "Coordinateur not found" });
    }
    res.status(200).json({ message: "Coordinateur deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting coordinateur", error: error.message });
  }
};

module.exports = {
  createCoordinateur,
  getAllCoordinateurs,
  getCoordinateurById,
  updateCoordinateur,
  deleteCoordinateur
};
