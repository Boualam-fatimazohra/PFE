const Formation = require('../Models/formation.model.js');
const Formateur  = require('../Models/formateur.model.js');
//  debut : creation d'un formation par un formateur bien précis :
const createFormation = async (req, res) => {
  try {
    // 1. Vérifier l'authentification
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ message: "Utilisateur non authentifié" });
    }

    // 2. Vérifier si l'utilisateur est un formateur
    const formateur = await Formateur.findOne({ utilisateur: userId });
    if (!formateur) {
      return res.status(401).json({ message: "Formateur non trouvé" });
    }

    // 3. Extraire les données du corps de la requête
    const { nom, dateDebut, dateFin, lienInscription } = req.body;
    if (!nom) {
      return res.status(400).json({ message: "Le nom de la formation est obligatoire" });
    }

    // 4. Récupérer l'image si elle est fournie
    let imageBuffer = null;
    let imageType = null;
    if (req.file) {
      imageBuffer = req.file.buffer;
      imageType = req.file.mimetype;
    }

    // 5. Créer une nouvelle formation
    const nouvelleFormation = new Formation({
      nom,
      dateDebut: dateDebut || null,
      dateFin: dateFin || null,
      description: "Aucun description",
      lienInscription,
      status: "Avenir",
      tags: "",
      categorie: "type1",
      niveau: "type1",
      formateur: formateur._id,
      image: imageBuffer, // Stocke l’image en buffer
      imageType: imageType // Stocke le type de l’image
    });

    // 6. Sauvegarder dans MongoDB
    const formationEnregistree = await nouvelleFormation.save();

    res.status(201).json({
      message: "Formation créée avec succès",
      formation: formationEnregistree
    });

  } catch (error) {
    console.error("Erreur création formation:", error);
    res.status(500).json({ message: "Erreur lors de la création de la formation", error: error.message });
  }
};

// fin : creation d'un formation par un formateur bien précis
// debut : recupération de tout les formations de tous les formateurs
const GetFormations = async (req, res) => {
  try {
    const formations = await Formation.find()
      .populate({ path: 'formateur', populate: { path: 'utilisateur' } });

    // Convertir l'image en base64 si elle existe
    const formationsAvecImages = formations.map((formation) => {
      return {
        ...formation._doc,
        image: formation.image
          ? `data:${formation.imageType};base64,${formation.image.toString("base64")}`
          : null
      };
    });

    res.status(200).json(formationsAvecImages);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération des formations", error: error.message });
  }
};

// fin : recupération de tout les formations de tous les formateurs
// debut :récupérer une formation par id passé en paramétre 
const GetOneFormation = async (req, res) => {
  try {
    const { id } = req.params; 
    if (!id || id.length !== 24) {
      return res.status(400).json({ message: "ID de formation invalide" });
    }

    const formation = await Formation.findById(id)
      .populate({ path: 'formateur', populate: { path: 'utilisateur' } });
    // Vérifier si la formation existe
    if (!formation) {
      return res.status(404).json({ message: "Formation non trouvée" });
    }
    // Convertir l'image en base64 si elle existe
    const formationAvecImage = {
      ...formation._doc,
      image: formation.image
        ? `data:${formation.imageType};base64,${formation.image.toString("base64")}`
        : null
    };

    res.status(200).json(formationAvecImage);
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

  try {
    // Récupérer l'image si elle est fournie
    let imageBuffer = null;
    let imageType = null;
    if (req.file) {
      imageBuffer = req.file.buffer;
      imageType = req.file.mimetype;
    }

    const updatedFields = { nom, dateDebut, dateFin, lienInscription, tags };
    if (imageBuffer) {
      updatedFields.image = imageBuffer;
      updatedFields.imageType = imageType;
    }

    const updatedFormation = await Formation.findByIdAndUpdate(id, updatedFields, { new: true });

    if (!updatedFormation) {
      return res.status(404).json({ message: "Formation non trouvée" });
    }

    res.status(200).json({ message: "Formation mise à jour avec succès", formation: updatedFormation });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la mise à jour de la formation", error: error.message });
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
