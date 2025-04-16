const FormationFab = require('../Models/formationFab.model');
const FormationBase = require('../Models/formationBase.model');
const EncadrantFormation = require('../Models/encadrantFormation.model');
const mongoose = require('mongoose');
const validateFile = (file, allowedTypes, maxSize) => {
  if (!file) return false;
  if (file.size > maxSize) return false;
  return allowedTypes.includes(file.mimetype);
};

/**
 * Create a new FormationFab
 * Creates both a FormationBase and links it to a FormationFab
 */

const createFormationFab = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    const {
      // Base formation fields
      nom,
      dateDebut,
      dateFin,
      description,
      
      // FormationFab specific fields
      status,
      categorie,
      niveau,
      tags,
      tauxSatisfaction,
      lienInscription,
      
      // Single encadrant ID for assignment
      encadrantId
    } = req.body;
    
    // Validate required fields
    if (!nom || !dateDebut || !dateFin) {
      return res.status(400).json({ message: "Le nom, dateDebut, dateFin de la formation est obligatoire" });
    }
    
    // Récupérer l'URL de l'image depuis le fichier téléchargé par multer
    const imageUrl = req.file ? req.file.path : null;
    
    // 1. Create the base formation
    const formationBase = new FormationBase({
      nom,
      dateDebut: dateDebut,
      dateFin: dateFin,
      description: description || "Aucune description",
      image: imageUrl // Utiliser l'URL de l'image téléchargée
    });
    
    const savedBaseFormation = await formationBase.save({ session });
    
    // 2. Create the FormationFab that references the base
    const formationFab = new FormationFab({
      baseFormation: savedBaseFormation._id,
      status: status || "Avenir",
      categorie: categorie || "type1",
      niveau: niveau || "type1",
      tags: tags || "",
      tauxSatisfaction: tauxSatisfaction || 0,
      lienInscription: lienInscription || ""
    });
    
    const savedFormationFab = await formationFab.save({ session });
    
    // 3. Assign a single encadrant if provided
    if (encadrantId) {
      // Validate encadrant ID
      if (!mongoose.Types.ObjectId.isValid(encadrantId)) {
        return res.status(400).json({ message: "Format d'ID d'encadrant invalide" });
      }
      
      // Create the assignment
      const assignment = new EncadrantFormation({
        encadrant: encadrantId,
        formationBase: savedBaseFormation._id,
        dateAssignment: new Date()
      });
      
      await assignment.save({ session });
    }
    
    // Commit the transaction
    await session.commitTransaction();
    session.endSession();
    
    // Fetch fully populated result for response
    const result = await FormationFab.findById(savedFormationFab._id)
      .populate('baseFormation');
    
    // Fetch associated encadrant (single)
    const encadrantAssignment = encadrantId ? await EncadrantFormation.findOne({
      formationBase: savedBaseFormation._id
    }).populate({
      path: 'encadrant',
      populate: {
        path: 'utilisateur',
        select: 'nom prenom email'
      }
    }) : null;
    
    res.status(201).json({
      message: "Formation Fab créée avec succès",
      formationFab: result,
      encadrant: encadrantAssignment
    });
  } catch (error) {
    // Abort transaction in case of error
    await session.abortTransaction();
    session.endSession();
    
    console.error("Error creating formation fab:", error);
    res.status(500).json({
      message: "Erreur lors de la création de la formation Fab",
      error: error.message
    });
  }
};
/**
 * Get all FormationFabs with populated references
 */
const getAllFormationFabs = async (req, res) => {
  try {
    const formationFabs = await FormationFab.find()
      .populate('baseFormation')
      .sort({ createdAt: -1 });

    res.status(200).json(formationFabs);
  } catch (error) {
    console.error("Error fetching formation fabs:", error);
    res.status(500).json({ 
      message: "Erreur lors de la récupération des formations Fab", 
      error: error.message 
    });
  }
};

/**
 * Get FormationFab by ID
 */
const getFormationFabById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Format d'ID invalide" });
    }

    const formationFab = await FormationFab.findById(id)
      .populate('baseFormation');

    if (!formationFab) {
      return res.status(404).json({ message: "Formation Fab non trouvée" });
    }

    res.status(200).json(formationFab);
  } catch (error) {
    console.error("Error fetching formation fab:", error);
    res.status(500).json({ 
      message: "Erreur lors de la récupération de la formation Fab", 
      error: error.message 
    });
  }
};

/**
 * Update a FormationFab
 */
const updateFormationFab = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { id } = req.params;
    const { 
      // Base formation fields
      nom, 
      dateDebut, 
      dateFin, 
      description, 
      image,
      
      // FormationFab specific fields
      status,
      categorie,
      niveau,
      tags,
      tauxSatisfaction,
      lienInscription
    } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Format d'ID invalide" });
    }

    // Find the FormationFab
    const formationFab = await FormationFab.findById(id);
    if (!formationFab) {
      return res.status(404).json({ message: "Formation Fab non trouvée" });
    }

    // Update base formation if fields are provided
    if (nom || dateDebut !== undefined || dateFin !== undefined || description || image || req.file) {
      const baseFormationUpdateData = {};
      if (nom) baseFormationUpdateData.nom = nom;
      if (dateDebut !== undefined) baseFormationUpdateData.dateDebut = dateDebut;
      if (dateFin !== undefined) baseFormationUpdateData.dateFin = dateFin;
      if (description) baseFormationUpdateData.description = description;
      if (image) baseFormationUpdateData.image = image;
      if (req.file) baseFormationUpdateData.image = req.file.path;

      await FormationBase.findByIdAndUpdate(
        formationFab.baseFormation,
        baseFormationUpdateData,
        { runValidators: true, session }
      );
    }

    // Update FormationFab
    const fabUpdateData = {};
    
    if (status) fabUpdateData.status = status;
    if (categorie) fabUpdateData.categorie = categorie;
    if (niveau) fabUpdateData.niveau = niveau;
    if (tags !== undefined) fabUpdateData.tags = tags;
    if (tauxSatisfaction !== undefined) fabUpdateData.tauxSatisfaction = tauxSatisfaction;
    if (lienInscription !== undefined) fabUpdateData.lienInscription = lienInscription;

    const updatedFormationFab = await FormationFab.findByIdAndUpdate(
      id,
      fabUpdateData,
      { new: true, runValidators: true, session }
    );

    // Commit the transaction
    await session.commitTransaction();
    session.endSession();

    // Fetch fully populated result for response
    const result = await FormationFab.findById(updatedFormationFab._id)
      .populate('baseFormation');

    res.status(200).json({
      message: "Formation Fab mise à jour avec succès",
      formationFab: result
    });
  } catch (error) {
    // Abort transaction in case of error
    await session.abortTransaction();
    session.endSession();

    console.error("Error updating formation fab:", error);
    res.status(500).json({ 
      message: "Erreur lors de la mise à jour de la formation Fab", 
      error: error.message 
    });
  }
};

/**
 * Delete a FormationFab and its base formation
 */
const deleteFormationFab = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Format d'ID invalide" });
    }

    // Find the FormationFab
    const formationFab = await FormationFab.findById(id);
    if (!formationFab) {
      return res.status(404).json({ message: "Formation Fab non trouvée" });
    }

    // Store the baseFormation ID for deletion
    const baseFormationId = formationFab.baseFormation;

    // Delete the FormationFab
    await FormationFab.findByIdAndDelete(id, { session });

    // Delete the base formation
    await FormationBase.findByIdAndDelete(baseFormationId, { session });

    // Commit the transaction
    await session.commitTransaction();
    session.endSession();

    res.status(200).json({
      message: "Formation Fab supprimée avec succès"
    });
  } catch (error) {
    // Abort transaction in case of error
    await session.abortTransaction();
    session.endSession();

    console.error("Error deleting formation fab:", error);
    res.status(500).json({ 
      message: "Erreur lors de la suppression de la formation Fab", 
      error: error.message 
    });
  }
};

/**
 * Get FormationFabs with specific status
 */
const getFormationFabsByStatus = async (req, res) => {
  try {
    const { status } = req.params;
    
    // Validate status
    const validStatuses = ["En Cours", "Terminé", "Avenir", "Replanifier"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ 
        message: "Status invalide. Les valeurs autorisées sont: 'En Cours', 'Terminé', 'Avenir', 'Replanifier'" 
      });
    }

    const formationFabs = await FormationFab.find({ status })
      .populate('baseFormation')
      .sort({ createdAt: -1 });

    res.status(200).json({
      count: formationFabs.length,
      formationFabs
    });
  } catch (error) {
    console.error("Error fetching formations by status:", error);
    res.status(500).json({ 
      message: "Erreur lors de la récupération des formations par statut", 
      error: error.message 
    });
  }
};

/**
 * Get FormationFabs by category
 */
const getFormationFabsByCategory = async (req, res) => {
  try {
    const { categorie } = req.params;
    
    // Validate category
    const validCategories = ["type1", "type2", "type3"];
    if (!validCategories.includes(categorie)) {
      return res.status(400).json({ 
        message: "Catégorie invalide. Les valeurs autorisées sont: 'type1', 'type2', 'type3'" 
      });
    }

    const formationFabs = await FormationFab.find({ categorie })
      .populate('baseFormation')
      .sort({ createdAt: -1 });

    res.status(200).json({
      count: formationFabs.length,
      formationFabs
    });
  } catch (error) {
    console.error("Error fetching formations by category:", error);
    res.status(500).json({ 
      message: "Erreur lors de la récupération des formations par catégorie", 
      error: error.message 
    });
  }
};

/**
 * Get FormationFabs by level
 */
const getFormationFabsByLevel = async (req, res) => {
  try {
    const { niveau } = req.params;
    
    // Validate level
    const validLevels = ["type1", "type2", "type3"];
    if (!validLevels.includes(niveau)) {
      return res.status(400).json({ 
        message: "Niveau invalide. Les valeurs autorisées sont: 'type1', 'type2', 'type3'" 
      });
    }

    const formationFabs = await FormationFab.find({ niveau })
      .populate('baseFormation')
      .sort({ createdAt: -1 });

    res.status(200).json({
      count: formationFabs.length,
      formationFabs
    });
  } catch (error) {
    console.error("Error fetching formations by level:", error);
    res.status(500).json({ 
      message: "Erreur lors de la récupération des formations par niveau", 
      error: error.message 
    });
  }
};

module.exports = {
  createFormationFab,
  getAllFormationFabs,
  getFormationFabById,
  updateFormationFab,
  deleteFormationFab,
  getFormationFabsByStatus,
  getFormationFabsByCategory,
  getFormationFabsByLevel
};