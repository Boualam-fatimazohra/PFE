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
    // Validation des fichiers
    if (req.files) {
      if (req.files.image && !validateFile(req.files.image[0], ['image/jpeg', 'image/png'], 2 * 1024 * 1024)) {
        return res.status(400).json({ message: "L'image doit être un JPEG ou PNG de moins de 2MB" });
      }
      
      if (req.files.participants && !validateFile(req.files.participants[0], ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'], 5 * 1024 * 1024)) {
        return res.status(400).json({ message: "La liste des participants doit être un fichier Excel (.xlsx) de moins de 5MB" });
      }
    }

    const { 
      nom: title,
      description,
      dateDebut,
      dateFin,
      status,
      categorie,
      niveau,
      tags,
      lienInscription: registrationLink
    } = req.body;

    // Validation des champs requis
    if (!title || !dateDebut || !dateFin || !status || !categorie || !niveau || !registrationLink) {
      return res.status(400).json({ message: "Tous les champs obligatoires doivent être remplis" });
    }

    // 1. Créer la formation de base
    const formationBase = new FormationBase({
      nom: title,
      dateDebut: new Date(dateDebut),
      dateFin: new Date(dateFin),
      description,
      image: req.files?.image?.[0]?.path || null
    });

    const savedBaseFormation = await formationBase.save({ session });

    // 2. Créer la FormationFab
    const formationFab = new FormationFab({
      baseFormation: savedBaseFormation._id,
      status,
      categorie,
      niveau,
      tags: tags || "",
      tauxSatisfaction: 0, // Valeur par défaut
      lienInscription: registrationLink
    });

    const savedFormationFab = await formationFab.save({ session });

    // 3. Traiter le fichier participants si présent
    if (req.files?.participants) {
      // Ici vous devriez ajouter la logique pour traiter le fichier Excel
      // et créer les bénéficiaires associés à la formation
    }

    await session.commitTransaction();
    session.endSession();

    res.status(201).json({
      message: "Formation créée avec succès",
      formation: await FormationFab.findById(savedFormationFab._id).populate('baseFormation')
    });

  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    
    console.error("Erreur:", error);
    res.status(500).json({ 
      message: "Erreur serveur", 
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