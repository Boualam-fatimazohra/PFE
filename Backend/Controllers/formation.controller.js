const Formation = require('../Models/formation.model.js');
const Formateur  = require('../Models/formateur.model.js');
//  debut : creation d'un formation par un formateur bien précis :
const createFormation = async (req, res) => {
  try {
    // 1. Get user ID from authentication
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ message: "Utilisateur non authentifié" });
    }

    // 2. Find the formateur associated with this user
    const formateur = await Formateur.findOne({ utilisateur: userId });
    if (!formateur) {
      return res.status(401).json({ message: "Formateur non trouvé" });
    }

    // 3. Extract data from request body
    const { 
      nom, 
      dateDebut, 
      dateFin,
      // description,
      lienInscription,
      // status,
      // tags,
      // categorie,
      // niveau
    } = req.body;

    // 4. Validate required fields
    if (!nom) {
      return res.status(400).json({ 
        message: "Le nom de la formation est obligatoire" 
      });
    }

    // 5. Get image path if file was uploaded
    const imagePath = req.file ? req.file.path : null;

    // 6. Create new formation
    const nouvelleFormation = new Formation({
      nom,
      dateDebut: dateDebut || null,
      dateFin: dateFin || null,
      description: "Aucun description",
      lienInscription,
      status:  "Avenir",
      tags:  "",
      categorie:  "type1",
      niveau: "type1",
      formateur: formateur._id,  // Use formateur._id instead of userId
      image: imagePath
    });

    // 7. Save the formation
    const formationEnregistree = await nouvelleFormation.save();

    // 8. Return the saved formation
    res.status(201).json({
      message: "Formation créée avec succès",
      formation: formationEnregistree
    });

  } catch (error) {
    console.error("Erreur création formation:", error);
    res.status(500).json({ 
      message: "Erreur lors de la création de la formation", 
      error: error.message 
    });
  }
};
// fin : creation d'un formation par un formateur bien précis
// debut : recupération de tout les formations de tous les formateurs
const GetFormations = async (req, res) => {
  try {
    // Populate formateur (et l'utilisateur lié) + classes
    const formations = await Formation.find()
      .populate({ path: 'formateur', populate: { path: 'utilisateur' } });    

    res.status(200).json(formations);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error fetching formations', 
      error: error.message
    });
  }
};
// fin : recupération de tout les formations de tous les formateurs
// debut :récupérer une formation par id passé en paramétre 
const GetOneFormation = async (req, res) => {
  try {
    const { id } = req.params; 
    if (!id || id.length !== 24) {
      return res.status(400).json({ message: "ID de formation invalide" });
    };
    const formation = await Formation.findById(id)
      .populate({ path: 'formateur', populate: { path: 'utilisateur' } }); 
    // Vérifier si la formation existe
    if (!formation) {
      return res.status(404).json({ message: "Formation non trouvée" });
    }
    // Retourner la formation trouvée
    res.status(200).json(formation);
  } catch (error) {
    res.status(500).json({ 
      message: "Erreur lors de la récupération de la formation",
      error: error.message 
    });
  }
};
// fin: récupérer une formation par id passé en paramétre 
// todo => debut : modifier une formation 
const UpdateFormation = async (req, res) => {
  const { id } = req.params;
  const { nom, dateDebut, dateFin, lienInscription, tags } = req.body;
  const imagePath = req.file ? `http://localhost:5000/uploads/${req.file.filename}` : null;
  console.log('Chemin de l\'image sauvegardé:', imagePath);    
  try {
    const updatedFormation = await Formation.findByIdAndUpdate(
      id,
      { nom, dateDebut, dateFin, lienInscription, tags, image: imagePath },
      { new: true } 
    );

    if (!updatedFormation) {
      return res.status(404).json({ message: 'Formation non trouvée' });
    }

    res.status(200).json({ message: 'Formation mise à jour avec succès', formation: updatedFormation });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la mise à jour de la formation', error: error.message });
  }
};
// fin : modifier une formation
// debut : deleteFormation par id 
const DeleteFormation = async (req, res) => {
  const { id } = req.params; 
  try {
    const result = await Formation.findByIdAndDelete(id);
    if (!result) {
      return res.status(404).json({ message: 'Formation non trouvée avec l\'ID fourni.' });
    }
    res.status(200).json({ message: 'Formation supprimée avec succès.' });
  } catch (error) {
    res.status(500).json({
      message: 'Erreur lors de la suppression de la formation',
      error: error.message,
    });
  }
};
// fin  : deleteFormation par id 

// fin: fonction qui retourne le nombre des formation d'un formateur
// fin:récupérer les formations d'un seule formateur
module.exports = { createFormation, GetFormations, GetOneFormation, UpdateFormation,DeleteFormation};
