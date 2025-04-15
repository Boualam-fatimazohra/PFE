const EncadrantFormation = require('../Models/encadrantFormation.model');
const Encadrant = require('../Models/encadrant.model');
const FormationBase = require('../Models/formationBase.model');
const mongoose = require('mongoose');

/**
 * Assign an encadrant to a formation
 */
const assignEncadrantToFormation = async (req, res) => {
  try {
    const { encadrantId, formationBaseId, dateAssignment } = req.body;

    // Validate required fields
    if (!encadrantId || !formationBaseId) {
      return res.status(400).json({ 
        message: "encadrantId and formationBaseId are required" 
      });
    }

    // Validate IDs
    if (!mongoose.Types.ObjectId.isValid(encadrantId) || 
        !mongoose.Types.ObjectId.isValid(formationBaseId)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }

    // Check if encadrant exists
    const encadrantExists = await Encadrant.findById(encadrantId);
    if (!encadrantExists) {
      return res.status(404).json({ message: "Encadrant not found" });
    }

    // Check if formation exists
    const formationExists = await FormationBase.findById(formationBaseId);
    if (!formationExists) {
      return res.status(404).json({ message: "Formation not found" });
    }

    // Check if assignment already exists
    const existingAssignment = await EncadrantFormation.findOne({
      encadrant: encadrantId,
      formationBase: formationBaseId
    });

    if (existingAssignment) {
      return res.status(409).json({ 
        message: "This encadrant is already assigned to this formation" 
      });
    }

    // Create new assignment
    const encadrantFormation = new EncadrantFormation({
      encadrant: encadrantId,
      formationBase: formationBaseId,
      dateAssignment: dateAssignment || new Date()
    });

    // Save the assignment
    await encadrantFormation.save();

    // Fetch the populated assignment for the response
    const populatedAssignment = await EncadrantFormation.findById(encadrantFormation._id)
      .populate({
        path: 'encadrant',
        populate: {
          path: 'utilisateur',
          select: 'nom prenom email'
        }
      })
      .populate('formationBase');

    res.status(201).json({
      message: "Encadrant assigned to formation successfully",
      assignment: populatedAssignment
    });
  } catch (error) {
    console.error("Error assigning encadrant to formation:", error);
    
    if (error.code === 11000) {
      return res.status(409).json({ 
        message: "This encadrant is already assigned to this formation",
        error: "Duplicate assignment"
      });
    }
    
    res.status(500).json({ 
      message: "Error assigning encadrant to formation", 
      error: error.message 
    });
  }
};

/**
 * Get all assignments
 */
const getAllAssignments = async (req, res) => {
  try {
    const assignments = await EncadrantFormation.find()
      .populate({
        path: 'encadrant',
        populate: {
          path: 'utilisateur',
          select: 'nom prenom email'
        }
      })
      .populate('formationBase')
      .sort({ createdAt: -1 });

    res.status(200).json(assignments);
  } catch (error) {
    console.error("Error fetching assignments:", error);
    res.status(500).json({ 
      message: "Error fetching assignments", 
      error: error.message 
    });
  }
};

/**
 * Get assignment by ID
 */
const getAssignmentById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }

    const assignment = await EncadrantFormation.findById(id)
      .populate({
        path: 'encadrant',
        populate: {
          path: 'utilisateur',
          select: 'nom prenom email'
        }
      })
      .populate('formationBase');

    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }

    res.status(200).json(assignment);
  } catch (error) {
    console.error("Error fetching assignment:", error);
    res.status(500).json({ 
      message: "Error fetching assignment", 
      error: error.message 
    });
  }
};

/**
 * Update assignment
 */
const updateAssignment = async (req, res) => {
  try {
    const { id } = req.params;
    const { dateAssignment } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }

    // Find the assignment
    const assignment = await EncadrantFormation.findById(id);
    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }

    // Prepare update data
    const updateData = {};
    if (dateAssignment) updateData.dateAssignment = dateAssignment;

    // Only proceed if there's something to update
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ message: "No valid fields to update" });
    }

    // Update the assignment
    const updatedAssignment = await EncadrantFormation.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    )
    .populate({
      path: 'encadrant',
      populate: {
        path: 'utilisateur',
        select: 'nom prenom email'
      }
    })
    .populate('formationBase');

    res.status(200).json({
      message: "Assignment updated successfully",
      assignment: updatedAssignment
    });
  } catch (error) {
    console.error("Error updating assignment:", error);
    res.status(500).json({ 
      message: "Error updating assignment", 
      error: error.message 
    });
  }
};

/**
 * Delete assignment
 */
const deleteAssignment = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }

    // Find and delete the assignment
    const deletedAssignment = await EncadrantFormation.findByIdAndDelete(id);

    if (!deletedAssignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }

    res.status(200).json({
      message: "Assignment deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting assignment:", error);
    res.status(500).json({ 
      message: "Error deleting assignment", 
      error: error.message 
    });
  }
};

/**
 * Get all formations for a specific encadrant
 */
const getFormationsByEncadrant = async (req, res) => {
  try {
    const { encadrantId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(encadrantId)) {
      return res.status(400).json({ message: "Invalid encadrant ID format" });
    }

    // Check if encadrant exists
    const encadrantExists = await Encadrant.findById(encadrantId);
    if (!encadrantExists) {
      return res.status(404).json({ message: "Encadrant not found" });
    }

    // Find all assignments for this encadrant
    const assignments = await EncadrantFormation.find({ encadrant: encadrantId })
      .populate('formationBase')
      .sort({ dateAssignment: -1 });

    // Extract formations
    const formations = assignments.map(assignment => ({
      formation: assignment.formationBase,
      assignmentId: assignment._id,
      dateAssignment: assignment.dateAssignment
    }));

    res.status(200).json({
      count: formations.length,
      formations
    });
  } catch (error) {
    console.error("Error fetching formations by encadrant:", error);
    res.status(500).json({ 
      message: "Error fetching formations for this encadrant", 
      error: error.message 
    });
  }
};

/**
 * Get all encadrants for a specific formation
 */
const getEncadrantsByFormation = async (req, res) => {
  try {
    const { formationId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(formationId)) {
      return res.status(400).json({ message: "Invalid formation ID format" });
    }

    // Check if formation exists
    const formationExists = await FormationBase.findById(formationId);
    if (!formationExists) {
      return res.status(404).json({ message: "Formation not found" });
    }

    // Find all assignments for this formation
    const assignments = await EncadrantFormation.find({ formationBase: formationId })
      .populate({
        path: 'encadrant',
        populate: {
          path: 'utilisateur',
          select: 'nom prenom email'
        }
      })
      .sort({ dateAssignment: -1 });

    // Extract encadrants
    const encadrants = assignments.map(assignment => ({
      encadrant: assignment.encadrant,
      assignmentId: assignment._id,
      dateAssignment: assignment.dateAssignment
    }));

    res.status(200).json({
      count: encadrants.length,
      encadrants
    });
  } catch (error) {
    console.error("Error fetching encadrants by formation:", error);
    res.status(500).json({ 
      message: "Error fetching encadrants for this formation", 
      error: error.message 
    });
  }
};

module.exports = {
  assignEncadrantToFormation,
  getAllAssignments,
  getAssignmentById,
  updateAssignment,
  deleteAssignment,
  getFormationsByEncadrant,
  getEncadrantsByFormation
};