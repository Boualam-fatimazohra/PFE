
const Formation = require('../Models/formation.model.js');
const Formateur  = require('../Models/formateur.model.js');
const { cloudinary } = require('../Config/cloudinaryConfig.js');
const FormationDraft = require('../Models/formationDraft.model'); // Assurez-vous d'importer le modèle

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
      description,
      lienInscription,
      status,
      tags,
      categorie,
      niveau
    } = req.body;

    // 4. Validate required fields
    if (!nom) {
      return res.status(400).json({ 
        message: "Le nom de la formation est obligatoire" 
      });
    }

    // 4. Récupérer l'image si elle est fournie
    // 5. Get image URL from Cloudinary (req.file is populated by multer)
    const imageUrl = req.file ? req.file.path : null;

    // 6. Create new formation
    const nouvelleFormation = new Formation({
      nom,
      dateDebut: dateDebut || null,
      dateFin: dateFin || null,
      description: description || "Aucun description",
      lienInscription,
      status: status || "Avenir",
      tags: tags || "",
      categorie: categorie || "type1",
      niveau: niveau || "type1",
      formateur: formateur._id,  
      image: imageUrl // This is now the Cloudinary URL
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

// Get All Formateurs formations
const getAllFormations = async (req, res) => {
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

// Get Formateur connected formations
const getFormations = async (req, res) => {
  try {
    // 1. Get user ID from authentication
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ message: "Utilisateur non authentifié" });
    }

    // 2. Find the formateur associated with this user
    const formateur = await Formateur.findOne({ utilisateur: userId });
    if (!formateur) {
      return res.status(404).json({ message: "Formateur non trouvé" });
    }

    // 3. Fetch all formations of this formateur
    const formations = await Formation.find({ formateur: formateur._id });

    // 4. Return formations
    res.status(200).json(formations);
  } catch (error) {
    res.status(500).json({ 
      message: "Erreur lors de la récupération des formations",
      error: error.message 
    });
  }
};

// Get One formation by Id
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

// Update formation by Id
const UpdateFormation = async (req, res) => {
  const { id } = req.params;
  const { nom, dateDebut, dateFin, lienInscription, tags, description, status, categorie, niveau } = req.body;

  try {
    const updateData = { nom, dateDebut, dateFin, lienInscription, tags, description, status, categorie, niveau };
    
    // If a new image is uploaded, add it to the update data
    if (req.file) {
      updateData.image = req.file.path; // Cloudinary URL
    }

    const updatedFormation = await Formation.findByIdAndUpdate(
      id,
      updateData,
      { new: true } 
    );

    if (!updatedFormation) {
      return res.status(404).json({ message: 'Formation non trouvée' });
    }

    res.status(200).json({ message: 'Formation mise à jour avec succès', formation: updatedFormation });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la mise à jour de la formation", error: error.message });
  }
};

// Delete Formation by Id
const DeleteFormation = async (req, res) => {
  const { id } = req.params; 
  try {
    // Get the formation first to get the image URL
    const formation = await Formation.findById(id);
    
    if (!formation) {
      return res.status(404).json({ message: 'Formation non trouvée avec l\'ID fourni.' });
    }
    
    // If there's an image, delete it from Cloudinary
    if (formation.image) {
      // Extract the public_id from the Cloudinary URL
      const publicId = formation.image.split('/').pop().split('.')[0];
      
      try {
        await cloudinary.uploader.destroy('formations/' + publicId);
      } catch (cloudinaryError) {
        console.error('Error deleting image from Cloudinary:', cloudinaryError);
        // Continue with deletion even if Cloudinary delete fails
      }
    }
    
    // Delete the formation from the database
    await Formation.findByIdAndDelete(id);
    
    res.status(200).json({ message: 'Formation supprimée avec succès.' });
  } catch (error) {
    res.status(500).json({
      message: 'Erreur lors de la suppression de la formation',
      error: error.message,
    });
  }
};

module.exports = { createFormation, getAllFormations, GetOneFormation, UpdateFormation,DeleteFormation, getFormations };
// const createFormation = async (req, res) => {
//   try {
//     // 1. Get user ID from authentication
//     const userId = req.user?.userId;
//     if (!userId) {
//       return res.status(401).json({ message: "Utilisateur non authentifié" });
//     }

//     // 2. Find the formateur associated with this user
//     const formateur = await Formateur.findOne({ utilisateur: userId });
//     if (!formateur) {
//       return res.status(401).json({ message: "Formateur non trouvé" });
//     }

//     // 3. Extract data from request body
//     const { 
//       nom, 
//       dateDebut, 
//       dateFin,
//       description,
//       lienInscription,
//       status,
//       tags,
//       categorie,
//       niveau
//     } = req.body;

//     // 4. Validate required fields
//     if (!nom) {
//       return res.status(400).json({ 
//         message: "Le nom de la formation est obligatoire" 
//       });
//     }

//     // 4. Récupérer l'image si elle est fournie
//     // 5. Get image URL from Cloudinary (req.file is populated by multer)
//     const imageUrl = req.file ? req.file.path : null;

//     // 6. Create new formation
//     const nouvelleFormation = new Formation({
//       nom,
//       dateDebut: dateDebut || null,
//       dateFin: dateFin || null,
//       description: description || "Aucun description",
//       lienInscription,
//       status: status || "Avenir",
//       tags: tags || "",
//       categorie: categorie || "type1",
//       niveau: niveau || "type1",
//       formateur: formateur._id,  
//       image: imageUrl // This is now the Cloudinary URL
//     });

//     // 7. Save the formation
//     const formationEnregistree = await nouvelleFormation.save();

//     // 8. Return the saved formation
//     res.status(201).json({
//       message: "Formation créée avec succès",
//       formation: formationEnregistree
//     });

//   } catch (error) {
//     console.error("Erreur création formation:", error);
//     res.status(500).json({ 
//       message: "Erreur lors de la création de la formation", 
//       error: error.message 
//     });
//   }
// };