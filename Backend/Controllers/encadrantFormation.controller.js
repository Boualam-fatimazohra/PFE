const EncadrantFormation = require('../Models/encadrantFormation.model');
const Encadrant = require('../Models/encadrant.model');
const FormationBase = require('../Models/formationBase.model');
const ProjetFab = require('../Models/projetFab.model');
const mongoose = require('mongoose');

const FormationFab = require('../Models/formationFab.model');
const { UtilisateurEntity } = require('../Models/utilisateurEntity');


const listFormationsWithEncadrants = async (req, res) => {
  try {
    // 1. Récupérer toutes les formations Fab avec leur base
    const formationsFab = await FormationFab.find()
      .populate({
        path: 'baseFormation',
        select: 'nom dateDebut dateFin description image' 
      })
      .lean();
    
    // 2. Récupérer les relations encadrants
    const formationIds = formationsFab.map(f => f.baseFormation._id);
    const relations = await EncadrantFormation.find({
      formationBase: { $in: formationIds }
    })
    .populate({
      path: 'encadrant',
      populate: {
        path: 'utilisateur',
        select: 'nom prenom email'
      }
    })
    .lean();
    
    // 3. Récupérer les IDs des utilisateurs (encadrants)
    const utilisateurIds = relations.map(rel => rel.encadrant?.utilisateur?._id).filter(Boolean);
    
    // 4. Récupérer les relations utilisateur-entité avec les détails de l'entité
    const utilisateurEntities = await UtilisateurEntity.find({
      id_utilisateur: { $in: utilisateurIds }
    })
    .populate({
      path: 'id_entity',
      select: 'nom description ville adresse'
    })
    .lean();
    
    // 5. Fusionner les données
    const result = formationsFab.map(fab => {
      const base = fab.baseFormation;
      const encadrants = relations
        .filter(rel => rel.formationBase.equals(base._id))
        .map(rel => {
          const utilisateurId = rel.encadrant?.utilisateur?._id;
          const entityRelation = utilisateurId ? 
            utilisateurEntities.find(ue => ue.id_utilisateur.equals(utilisateurId)) : 
            null;
          
          const entity = entityRelation?.id_entity || null;
          
          return {
            nom: rel.encadrant?.utilisateur?.nom,
            prenom: rel.encadrant?.utilisateur?.prenom,
            email: rel.encadrant?.utilisateur?.email,
            type: rel.encadrant?.type,
            specialite: rel.encadrant?.specialite,
            dateAssignment: rel.dateAssignment,
            entity: entity ? {
              id: entity._id,
              nom: entity.nom,
              description: entity.description,
              ville: entity.ville,
              adresse: entity.adresse
            } : null
          };
        });
      
      return {
        ...base,
        image: base.image, // Inclure l'URL de l'image
        status: fab.status,
        categorie: fab.categorie,
        niveau: fab.niveau,
        encadrants
      };
    });
    
    res.status(200).json({
      success: true,
      count: result.length,
      data: result
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération des formations",
      error: error.message
    });
  }
};

// Récupérer la liste des projets de fabrication avec leurs encadrants et détails d'entités
const listProjetsFabWithEncadrants = async (req, res) => {
  try {
    // 1. Récupérer tous les projets Fab avec leur formation de base
    const projetsFab = await ProjetFab.find()
      .populate({
        path: 'baseFormation',
        select: 'nom dateDebut dateFin description image'
      })
      .lean();
    
    // 2. Récupérer les relations encadrants
    const formationIds = projetsFab.map(p => p.baseFormation._id);
    const relations = await EncadrantFormation.find({
      formationBase: { $in: formationIds }
    })
    .populate({
      path: 'encadrant',
      populate: {
        path: 'utilisateur',
        select: 'nom prenom email'
      }
    })
    .lean();
    
    // 3. Récupérer les IDs des utilisateurs (encadrants)
    const utilisateurIds = relations.map(rel => rel.encadrant?.utilisateur?._id).filter(Boolean);
    
    // 4. Récupérer les relations utilisateur-entité avec les détails de l'entité
    const utilisateurEntities = await UtilisateurEntity.find({
      id_utilisateur: { $in: utilisateurIds }
    })
    .populate({
      path: 'id_entity',
      select: 'nom description ville adresse'
    })
    .lean();
    
    // 5. Fusionner les données
    const result = projetsFab.map(projet => {
      const base = projet.baseFormation;
      const encadrants = relations
        .filter(rel => rel.formationBase.equals(base._id))
        .map(rel => {
          const utilisateurId = rel.encadrant?.utilisateur?._id;
          const entityRelation = utilisateurId ?
            utilisateurEntities.find(ue => ue.id_utilisateur.equals(utilisateurId)) :
            null;
          
          const entity = entityRelation?.id_entity || null;
          
          return {
            nom: rel.encadrant?.utilisateur?.nom,
            prenom: rel.encadrant?.utilisateur?.prenom,
            email: rel.encadrant?.utilisateur?.email,
            type: rel.encadrant?.type,
            specialite: rel.encadrant?.specialite,
            dateAssignment: rel.dateAssignment,
            entity: entity ? {
              id: entity._id,
              nom: entity.nom,
              description: entity.description,
              ville: entity.ville,
              adresse: entity.adresse
            } : null
          };
        });
      
      return {
        _id: projet._id,
        baseFormation: {
          _id: base._id,
          nom: base.nom,
          dateDebut: base.dateDebut,
          dateFin: base.dateFin,
          description: base.description,
          image: base.image
        },
        status: projet.status,
        progress: projet.progress,
        nombreParticipants: projet.nombreParticipants,
        encadrants
      };
    });
    
    res.status(200).json({
      success: true,
      count: result.length,
      data: result
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération des projets de fabrication",
      error: error.message
    });
  }
};

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
  getEncadrantsByFormation,
  listFormationsWithEncadrants,
  listProjetsFabWithEncadrants
};