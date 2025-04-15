const Fab = require('../Models/fab.model');
const { Entity } = require('../Models/entity.model');
const mongoose = require('mongoose');

/**
 * Create a new Fab entity
 * @route POST /api/fabs
 * @access Private - Admin only
 */
const createFab = async (req, res) => {
  try {
    const { ville } = req.body;

    // Validate required fields
    if (!ville) {
      return res.status(400).json({ message: "Ville is required" });
    }

    // Check if Entity with same ville and type "Fab" already exists
    const existingEntity = await Entity.findOne({ ville: { $regex: `^${ville}$`, $options: 'i' }, type: "Fab" });

    if (existingEntity) {
      return res.status(400).json({ message: `A 'Fab' entity with ville '${ville}' already exists.` });
    }

    // First, create the base Entity
    const entity = new Entity({
      ville,
      type: "Fab" 
    });

    await entity.save();

    // Then create the Fab with reference to the base entity
    const newFab = new Fab({
      entity: entity._id,
    });

    await newFab.save();

    res.status(201).json({
      message: "Fab created successfully",
      fab: {
        ...newFab._doc,
        entity: entity
      }
    });
  } catch (error) {
    console.error("Error creating Fab:", error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: "Validation error", errors: error.errors });
    }
    res.status(500).json({ message: "Error creating Fab", error: error.message });
  }
};

/**
 * Get all Fab entities
 * @route GET /api/fabs
 * @access Private - Admin, Manager
 */
const getAllFabs = async (req, res) => {
  try {
    const fabs = await Fab.find().populate('entity').sort({ createdAt: -1 });

    res.status(200).json(fabs);
  } catch (error) {
    console.error("Error fetching Fabs:", error);
    res.status(500).json({ message: "Error fetching Fabs", error: error.message });
  }
};

/**
 * Get a single Fab by ID
 * @route GET /api/fabs/:id
 * @access Private - Admin, Manager
 */
const getFabById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }

    const fab = await Fab.findById(id).populate('entity');

    if (!fab) {
      return res.status(404).json({ message: "Fab not found" });
    }

    res.status(200).json(fab);
  } catch (error) {
    console.error("Error fetching Fab:", error);
    res.status(500).json({ message: "Error fetching Fab", error: error.message });
  }
};

/**
 * Update a Fab
 * @route PUT /api/fabs/:id
 * @access Private - Admin only
 */
const updateFab = async (req, res) => {
  try {
    const { id } = req.params;
    const { ville } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }

    // Find the Fab first
    const fab = await Fab.findById(id);
    if (!fab) {
      return res.status(404).json({ message: "Fab not found" });
    }

    // If ville is provided, update the Entity
    if (ville) {
      await Entity.findByIdAndUpdate(
        fab.entity,
        { ville },
        { runValidators: true }
      );
    }

    // Get the updated Fab with populated entity
    const updatedFab = await Fab.findById(id).populate('entity');

    res.status(200).json({
      message: "Fab updated successfully",
      fab: updatedFab
    });
  } catch (error) {
    console.error("Error updating Fab:", error);
    res.status(500).json({ message: "Error updating Fab", error: error.message });
  }
};

/**
 * Delete a Fab and its related Entity
 * @route DELETE /api/fabs/:id
 * @access Private - Admin only
 */
const deleteFab = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }

    // Find the Fab to get the Entity reference
    const fab = await Fab.findById(id);
    if (!fab) {
      return res.status(404).json({ message: "Fab not found" });
    }

    // Delete the Fab
    await Fab.findByIdAndDelete(id);

    // Delete the associated Entity
    await Entity.findByIdAndDelete(fab.entity);

    res.status(200).json({ message: "Fab deleted successfully" });
  } catch (error) {
    console.error("Error deleting Fab:", error);
    res.status(500).json({ message: "Error deleting Fab", error: error.message });
  }
};

/**
 * Get stats for a specific Fab - This is a placeholder for future implementation
 * @route GET /api/fabs/:id/stats
 * @access Private - Admin, Manager
 */
const getFabStats = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }

    // Find the Fab first
    const fab = await Fab.findById(id).populate('entity');
    if (!fab) {
      return res.status(404).json({ message: "Fab not found" });
    }

    // Placeholder for gathering statistics
    // In a real implementation, you would query related collections here
    const stats = {
      totalFormateurs: 0, // To be implemented: count formateurs associated with this Fab
      totalFormations: 0, // To be implemented: count formations associated with this Fab
      totalBeneficiaires: 0, // To be implemented: count beneficiaires associated with this Fab
      activeFormations: 0 // To be implemented: count active formations
    };

    res.status(200).json({
      fab: fab,
      stats: stats
    });
  } catch (error) {
    console.error("Error fetching Fab stats:", error);
    res.status(500).json({ message: "Error fetching Fab statistics", error: error.message });
  }
};

module.exports = {
  createFab,
  getAllFabs,
  getFabById,
  updateFab,
  deleteFab,
  getFabStats
};