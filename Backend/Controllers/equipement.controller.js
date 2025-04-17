const Equipement = require('../Models/equipement.model');

// create equipement
exports.createEquipement = async (req, res) => {
    try {
      // Si une image a été uploadée, ajoutez son chemin au body
      if (req.file) {
        req.body.image = `/${req.file.path.replace(/\\/g, '/')}`;
      }
  
      const equipement = await Equipement.create(req.body);
      
      res.status(201).json({
        success: true,
        data: equipement
      });
    } catch (err) {
      // Si une erreur se produit et qu'une image a été uploadée, supprimez-la
      if (req.file) {
        fs.unlink(req.file.path, (unlinkErr) => {
          if (unlinkErr) console.error("Erreur lors de la suppression du fichier:", unlinkErr);
        });
      }
  
      if (err.name === 'ValidationError') {
        const messages = Object.values(err.errors).map(val => val.message);
        return res.status(400).json({
          success: false,
          message: messages.join(', ')
        });
      } else {
        res.status(500).json({
          success: false,
          message: "Erreur lors de la création de l'équipement",
          error: err.message
        });
      }
    }
  };

// Get all equipements
exports.getAllEquipements = async (req, res) => {
  try {
    const equipements = await Equipement.find()
      .populate({
        path: 'fab',
        populate: {
          path: 'entity'
        }
      });
    
    res.status(200).json({
      success: true,
      count: equipements.length,
      data: equipements
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération des équipements",
      error: err.message
    });
  }
};

// Get single equipement by ID
exports.getEquipementById = async (req, res) => {
  try {
    const equipement = await Equipement.findById(req.params.id)
      .populate({
        path: 'fab',
        populate: {
          path: 'entity'
        }
      });

    if (!equipement) {
      return res.status(404).json({
        success: false,
        message: "Équipement non trouvé"
      });
    }

    res.status(200).json({
      success: true,
      data: equipement
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération de l'équipement",
      error: err.message
    });
  }
};

// Create new equipement


// Update equipement
exports.updateEquipement = async (req, res) => {
  try {
    const equipement = await Equipement.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    ).populate({
      path: 'fab',
      populate: {
        path: 'entity'
      }
    });

    if (!equipement) {
      return res.status(404).json({
        success: false,
        message: "Équipement non trouvé"
      });
    }

    res.status(200).json({
      success: true,
      data: equipement
    });
  } catch (err) {
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', ')
      });
    } else {
      res.status(500).json({
        success: false,
        message: "Erreur lors de la mise à jour de l'équipement",
        error: err.message
      });
    }
  }
};

// Delete equipement
exports.deleteEquipement = async (req, res) => {
  try {
    const equipement = await Equipement.findByIdAndDelete(req.params.id);

    if (!equipement) {
      return res.status(404).json({
        success: false,
        message: "Équipement non trouvé"
      });
    }

    res.status(200).json({
      success: true,
      message: "Équipement supprimé avec succès"
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de la suppression de l'équipement",
      error: err.message
    });
  }
};

// Get equipements by fab
exports.getEquipementsByFab = async (req, res) => {
  try {
    const equipements = await Equipement.find({ fab: req.params.fabId })
      .populate({
        path: 'fab',
        populate: {
          path: 'entity'
        }
      });
    
    res.status(200).json({
      success: true,
      count: equipements.length,
      data: equipements
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération des équipements par fab",
      error: err.message
    });
  }
};

// Get equipements by état
exports.getEquipementsByEtat = async (req, res) => {
  try {
    const equipements = await Equipement.find({ etat: req.params.etat })
      .populate({
        path: 'fab',
        populate: {
          path: 'entity'
        }
      });
    
    res.status(200).json({
      success: true,
      count: equipements.length,
      data: equipements
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération des équipements par état",
      error: err.message
    });
  }
};