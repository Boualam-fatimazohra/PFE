const FormationBase = require('../Models/formationBase.model');
const FormationEncadrant = require('../Models/formationEncadrant.model');
const Encadrant = require('../Models/encadrant.model');
const mongoose = require('mongoose');

/**
 * Create a new formation base
 */
const createFormationBase = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { 
      nom, 
      dateDebut, 
      dateFin, 
      description, 
      image,
      encadrants 
    } = req.body;

    // Validate required fields
    if (!nom) {
      return res.status(400).json({ 
        message: "Le nom de la formation est obligatoire" 
      });
    }

    // Create new formation base
    const formationBase = new FormationBase({
      nom,
      dateDebut: dateDebut || null,
      dateFin: dateFin || null,
      description: description || "Aucune description",
      image: req.file ? req.file.path : image, // Support both direct path and file upload
    });

    // Save the formation base
    const savedFormation = await formationBase.save({ session });

    // If encadrants are provided, create the relations
    if (encadrants && Array.isArray(encadrants) && encadrants.length > 0) {
      const formationEncadrantPromises = encadrants.map(async (encadrantData) => {
        // encadrantData should contain encadrantId and optionally role
        if (!encadrantData.encadrantId) {
          throw new Error("encadrantId is required for each encadrant");
        }

        // Verify if encadrant exists
        const encadrantExists = await Encadrant.findById(encadrantData.encadrantId);
        if (!encadrantExists) {
          throw new Error(`Encadrant with ID ${encadrantData.encadrantId} not found`);
        }

        // Create formation-encadrant relation
        const formationEncadrant = new FormationEncadrant({
          formation: savedFormation._id,
          encadrant: encadrantData.encadrantId,
        });

        return formationEncadrant.save({ session });
      });

      await Promise.all(formationEncadrantPromises);
    }

    // Commit the transaction
    await session.commitTransaction();
    session.endSession();

    // Fetch the complete formation with encadrants for response
    const populatedFormation = await FormationBase.findById(savedFormation._id);
    const formationEncadrants = await FormationEncadrant.find({ formation: savedFormation._id })
      .populate('encadrant');

    res.status(201).json({
      message: "Formation créée avec succès",
      formation: populatedFormation,
      encadrants: formationEncadrants
    });
  } catch (error) {
    // Abort transaction in case of error
    await session.abortTransaction();
    session.endSession();

    console.error("Error creating formation base:", error);
    res.status(500).json({ 
      message: "Erreur lors de la création de la formation", 
      error: error.message 
    });
  }
};

/**
 * Get all formation bases with their encadrants
 */
const getAllFormationBases = async (req, res) => {
  try {
    // Fetch all formation bases
    const formationBases = await FormationBase.find().sort({ createdAt: -1 });

    // For each formation, get its encadrants
    const formationsWithEncadrants = await Promise.all(
      formationBases.map(async (formation) => {
        const formationEncadrants = await FormationEncadrant.find({ formation: formation._id })
          .populate({
            path: 'encadrant',
            populate: {
              path: 'utilisateur',
              select: 'nom prenom email'
            }
          });

        const encadrants = formationEncadrants.map(fe => ({
          encadrant: fe.encadrant,
          dateAssignment: fe.dateAssignment
        }));

        return {
          ...formation.toObject(),
          encadrants
        };
      })
    );

    res.status(200).json(formationsWithEncadrants);
  } catch (error) {
    console.error("Error fetching formation bases:", error);
    res.status(500).json({ 
      message: "Error fetching formations", 
      error: error.message 
    });
  }
};

/**
 * Get a single formation base by ID with its encadrants
 */
const getFormationBaseById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }

    // Fetch the formation
    const formation = await FormationBase.findById(id);
    if (!formation) {
      return res.status(404).json({ message: "Formation not found" });
    }

    // Fetch the encadrants for this formation
    const formationEncadrants = await FormationEncadrant.find({ formation: id })
      .populate({
        path: 'encadrant',
        populate: {
          path: 'utilisateur',
          select: 'nom prenom email' // Only select necessary fields
        }
      });

    const formationWithEncadrants = {
      ...formation.toObject(),
      encadrants: formationEncadrants.map(fe => ({
        encadrant: fe.encadrant,
        dateAssignment: fe.dateAssignment
      }))
    };

    res.status(200).json(formationWithEncadrants);
  } catch (error) {
    console.error("Error fetching formation:", error);
    res.status(500).json({ 
      message: "Error fetching formation", 
      error: error.message 
    });
  }
};

/**
 * Update a formation base
 */
const updateFormationBase = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { id } = req.params;
    const { 
      nom, 
      dateDebut, 
      dateFin, 
      description, 
      image, 
      encadrants 
    } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }

    // Check if formation exists
    const formation = await FormationBase.findById(id);
    if (!formation) {
      return res.status(404).json({ message: "Formation not found" });
    }

    // Prepare update data
    const updateData = {};
    if (nom) updateData.nom = nom;
    if (dateDebut) updateData.dateDebut = dateDebut;
    if (dateFin) updateData.dateFin = dateFin;
    if (description) updateData.description = description;
    if (image) updateData.image = image;
    if (req.file) updateData.image = req.file.path;

    // Update formation base
    const updatedFormation = await FormationBase.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true, session }
    );

    // If encadrants are provided, update the relations
    if (encadrants && Array.isArray(encadrants)) {
      // Optional: Remove existing encadrant relations
      await FormationEncadrant.deleteMany({ formation: id }, { session });

      // Create new encadrant relations
      if (encadrants.length > 0) {
        const formationEncadrantPromises = encadrants.map(async (encadrantData) => {
          if (!encadrantData.encadrantId) {
            throw new Error("encadrantId is required for each encadrant");
          }

          // Verify if encadrant exists
          const encadrantExists = await Encadrant.findById(encadrantData.encadrantId);
          if (!encadrantExists) {
            throw new Error(`Encadrant with ID ${encadrantData.encadrantId} not found`);
          }

          // Create formation-encadrant relation
          const formationEncadrant = new FormationEncadrant({
            formation: id,
            encadrant: encadrantData.encadrantId,
          });

          return formationEncadrant.save({ session });
        });

        await Promise.all(formationEncadrantPromises);
      }
    }

    // Commit the transaction
    await session.commitTransaction();
    session.endSession();

    // Fetch the updated formation with encadrants for response
    const formationEncadrants = await FormationEncadrant.find({ formation: id })
      .populate({
        path: 'encadrant',
        populate: {
          path: 'utilisateur',
          select: 'nom prenom email'
        }
      });

    res.status(200).json({
      message: "Formation mise à jour avec succès",
      formation: updatedFormation,
      encadrants: formationEncadrants.map(fe => ({
        encadrant: fe.encadrant,
        dateAssignment: fe.dateAssignment
      }))
    });
  } catch (error) {
    // Abort transaction in case of error
    await session.abortTransaction();
    session.endSession();

    console.error("Error updating formation:", error);
    res.status(500).json({ 
      message: "Error updating formation", 
      error: error.message 
    });
  }
};

/**
 * Delete a formation base and its relations
 */
const deleteFormationBase = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }

    // Check if formation exists
    const formation = await FormationBase.findById(id);
    if (!formation) {
      return res.status(404).json({ message: "Formation not found" });
    }

    // Delete formation-encadrant relations
    await FormationEncadrant.deleteMany({ formation: id }, { session });

    // Delete the formation
    await FormationBase.findByIdAndDelete(id, { session });

    // Commit the transaction
    await session.commitTransaction();
    session.endSession();

    res.status(200).json({
      message: "Formation supprimée avec succès"
    });
  } catch (error) {
    // Abort transaction in case of error
    await session.abortTransaction();
    session.endSession();

    console.error("Error deleting formation:", error);
    res.status(500).json({ 
      message: "Error deleting formation", 
      error: error.message 
    });
  }
};

/**
 * Add an encadrant to a formation
 */
const addEncadrantToFormation = async (req, res) => {
  try {
    const { formationId, encadrantId } = req.body;

    // Validate required fields
    if (!formationId || !encadrantId) {
      return res.status(400).json({ 
        message: "formationId and encadrantId are required" 
      });
    }

    // Validate IDs
    if (!mongoose.Types.ObjectId.isValid(formationId) || 
        !mongoose.Types.ObjectId.isValid(encadrantId)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }

    // Check if formation and encadrant exist
    const formationExists = await FormationBase.findById(formationId);
    if (!formationExists) {
      return res.status(404).json({ message: "Formation not found" });
    }

    const encadrantExists = await Encadrant.findById(encadrantId);
    if (!encadrantExists) {
      return res.status(404).json({ message: "Encadrant not found" });
    }

    // Check if relation already exists
    const existingRelation = await FormationEncadrant.findOne({
      formation: formationId,
      encadrant: encadrantId
    });

    if (existingRelation) {
      return res.status(409).json({ 
        message: "This encadrant is already assigned to this formation" 
      });
    }

    // Create new relation
    const formationEncadrant = new FormationEncadrant({
      formation: formationId,
      encadrant: encadrantId,
    });

    await formationEncadrant.save();

    // Fetch the complete relation data for response
    const populatedRelation = await FormationEncadrant.findById(formationEncadrant._id)
      .populate('formation')
      .populate({
        path: 'encadrant',
        populate: {
          path: 'utilisateur',
          select: 'nom prenom email'
        }
      });

    res.status(201).json({
      message: "Encadrant added to formation successfully",
      relation: populatedRelation
    });
  } catch (error) {
    console.error("Error adding encadrant to formation:", error);
    res.status(500).json({ 
      message: "Error adding encadrant to formation", 
      error: error.message 
    });
  }
};

/**
 * Remove an encadrant from a formation
 */
const removeEncadrantFromFormation = async (req, res) => {
  try {
    const { formationId, encadrantId } = req.params;

    // Validate IDs
    if (!mongoose.Types.ObjectId.isValid(formationId) || 
        !mongoose.Types.ObjectId.isValid(encadrantId)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }

    // Check if relation exists
    const relation = await FormationEncadrant.findOne({
      formation: formationId,
      encadrant: encadrantId
    });

    if (!relation) {
      return res.status(404).json({ 
        message: "Relation between this formation and encadrant not found" 
      });
    }

    // Delete the relation
    await FormationEncadrant.findByIdAndDelete(relation._id);

    res.status(200).json({
      message: "Encadrant removed from formation successfully"
    });
  } catch (error) {
    console.error("Error removing encadrant from formation:", error);
    res.status(500).json({ 
      message: "Error removing encadrant from formation", 
      error: error.message 
    });
  }
};



module.exports = {
  createFormationBase,
  getAllFormationBases,
  getFormationBaseById,
  updateFormationBase,
  deleteFormationBase,
  addEncadrantToFormation,
  removeEncadrantFromFormation
};