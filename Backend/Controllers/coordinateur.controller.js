const Coordinateur = require("../Models/coordinateur.modell");
const Manager = require("../Models/manager.model");

// Create a new Coordinateur
const createCoordinateur = async (req, res) => {
  try {
    const { utilisateur, manager } = req.body;

    // Check if the referenced manager exists
    const managerExists = await Manager.findById(manager);
    if (!managerExists) {
      return res.status(404).json({ message: "Manager not found" });
    }

    const coordinateur = new Coordinateur({ utilisateur, manager });
    await coordinateur.save();

    res.status(201).json(coordinateur);
  } catch (error) {
    res.status(500).json({ message: "Error creating coordinateur", error: error.message });
  }
};

// Get all Coordinateurs (with Manager details)
const getAllCoordinateurs = async (req, res) => {
  try {
    const coordinateurs = await Coordinateur.find().populate("utilisateur").populate("manager");
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
    const { utilisateur, manager } = req.body;

    // Check if manager exists before updating
    if (manager) {
      const managerExists = await Manager.findById(manager);
      if (!managerExists) {
        return res.status(404).json({ message: "Manager not found" });
      }
    }

    const updatedCoordinateur = await Coordinateur.findByIdAndUpdate(
      req.params.id,
      { utilisateur, manager },
      { new: true, runValidators: true }
    ).populate("utilisateur").populate("manager");

    if (!updatedCoordinateur) {
      return res.status(404).json({ message: "Coordinateur not found" });
    }

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
