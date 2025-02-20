const Formation = require('../Models/formation.model.js');
const Formateur  = require('../Models/formateur.model.js');
//  debut : creation d'un formation par un formateur bien précis :
const createFormation = async (req, res) => {
  console.log('===== DEBUG UPLOAD =====');
  console.log('req.file:', req.file);
  console.log('req.files:', req.files);
  console.log('Content-Type:', req.get('Content-Type'));
  console.log('req.body:', req.body);
  console.log('======================');
  const { nom, dateDebut, dateFin, lienInscription } = req.body;
 
  try {
    // Vérification de l'authentification
    const id = req.user?.userId;
    if (!id) {
      return res.status(401).json({ message: "Utilisateur non authentifié" });
    }
    if (!nom || !dateDebut || !dateFin) {
      return res.status(400).json({ 
        message: "Les champs nom, dateDebut, dateFin et categorie sont obligatoires." 
      });
    }

    // Validation des dates
    const debutDate = new Date(dateDebut);
    const finDate = new Date(dateFin);
    
    if (isNaN(debutDate.getTime()) || isNaN(finDate.getTime())) {
      return res.status(400).json({ 
        message: "Les dates fournies ne sont pas valides" 
      });
    }

    if (finDate < debutDate) {
      return res.status(400).json({ 
        message: "La date de fin ne peut pas être antérieure à la date de début" 
      });
    }
   
    // Traitement du chemin de l'image
// Traitement du chemin de l'image
const imagePath = req.file ? `http://localhost:5000/uploads/${req.file.filename}` : null;
console.log('Chemin de l\'image sauvegardé:', imagePath);   
    // Création de la nouvelle formation
    const nouvelleFormation = new Formation({
      nom,
      dateDebut,
      dateFin,
      formateur: id,
      image: imagePath,
      lienInscription
    });

    console.log("Requête reçue pour ajouter une formation:", {
      ...req.body,
      imagePath,
      formateurId: id
    });

    const formationEnregistree = await nouvelleFormation.save();
    res.status(201).json(formationEnregistree);

  } catch (error) {
    console.error("Erreur lors de la création de la formation:", error);
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
  const { nom, description, status } = req.body;
  let image = req.file ? req.file.filename : null; // Si un fichier est uploadé
  try {
    // Vérifier si la formation existe
    const formation = await Formation.findById(id);
    if (!formation) {
      return res.status(404).json({ message: 'Formation non trouvée' });
    }
    // Mettre à jour les champs fournis
    formation.nom = nom || formation.nom;
    formation.description = description || formation.description;
    formation.status = status || formation.status;
    // Mettre à jour l'image seulement si une nouvelle est uploadée
    if (image) {
      console.log(image);
      formation.image = image;
    }

    // Sauvegarder la formation mise à jour
    await formation.save();

    res.status(200).json({ message: 'Formation mise à jour avec succès', formation });
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
module.exports = { createFormation, GetFormations, GetOneFormation, UpdateFormation,DeleteFormation };
