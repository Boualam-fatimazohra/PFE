
const Formation = require('../Models/formation.model.js');
const Formateur  = require('../Models/formateur.model.js');
const Manager = require('../Models/manager.model.js');
const Notification = require('../Models/notification.model.js');
const { cloudinary } = require('../Config/cloudinaryConfig.js');
const FormationDraft = require('../Models/formationDraft.model'); // Assurez-vous d'importer le modèle
const { determineFormationStatus } = require('../utils/formationUtils.js')
const BeneficiaireFormation = require("../Models/beneficiairesFormation.js");
const mongoose=require("mongoose");
//  debut : creation d'un formation par un formateur bien précis :
const createFormation = async (req, res) => {
  console.log("Create Formation")
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

    const status = determineFormationStatus(dateDebut, dateFin);

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

    // 8. Find manager to notify
    if (formateur.manager) {
      try {
        const managerDoc = await Manager.findById(formateur.manager);
        if (managerDoc && managerDoc.utilisateur) {
          // 9. Create notification for manager
          const notification = new Notification({
            sender: userId,
            receiver: managerDoc.utilisateur,
            type: "formation",
            status: "accepted",
            entityId: formationEnregistree._id
          });
          
          await notification.save();
          console.log("Notification saved: ", notification);
          // 10. Send real-time notification if socket.io is available
          const io = req.app.get('io');
          if (io) {
            io.to(managerDoc.utilisateur.toString()).emit('notification', {
              _id: notification._id,
              type: notification.type,
              createdAt: notification.createdAt
            });
          }
        }
      } catch (notifError) {
        console.error("Error creating notification:", notifError);
        // Continue even if notification fails
      }
    }

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
// const DeleteFormation = async (req, res) => {
//   const { id } = req.params; 
//   try {
//     // Get the formation first to get the image URL
//     const formation = await Formation.findById(id);
    
//     if (!formation) {
//       return res.status(404).json({ message: 'Formation non trouvée avec l\'ID fourni.' });
//     }
    
//     // If there's an image, delete it from Cloudinary
//     if (formation.image) {
//       // Extract the public_id from the Cloudinary URL
//       const publicId = formation.image.split('/').pop().split('.')[0];
      
//       try {
//         await cloudinary.uploader.destroy('formations/' + publicId);
//       } catch (cloudinaryError) {
//         console.error('Error deleting image from Cloudinary:', cloudinaryError);
//         // Continue with deletion even if Cloudinary delete fails
//       }
//     }
    
//     // Delete the formation from the database
//     await Formation.findByIdAndDelete(id);
    
//     res.status(200).json({ message: 'Formation supprimée avec succès.' });
//   } catch (error) {
//     res.status(500).json({
//       message: 'Erreur lors de la suppression de la formation',
//       error: error.message,
//     });
//   }
// };
const DeleteFormation = async (req, res) => {
  const { id } = req.params;
  
  // Démarrer une session pour la transaction
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    // Vérifier si l'ID est un ObjectId MongoDB valide
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'ID de formation invalide.' });
    }
    
    // Récupérer la formation
    const formation = await Formation.findById(id).session(session);
    
    if (!formation) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: 'Formation non trouvée avec l\'ID fourni.' });
    }
    
    // Supprimer les associations BeneficiareFormation
    const beneficiareDeleteResult = await BeneficiaireFormation.deleteMany({ formation: id }).session(session);
    console.log(`${beneficiareDeleteResult.deletedCount} associations formation-bénéficiaire supprimées`);
    
    // Supprimer l'image de Cloudinary si elle existe
    if (formation.image) {
      try {
        // Extraire le public_id de l'URL Cloudinary
        const publicId = formation.image.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy('formations/' + publicId);
        console.log(`Image supprimée de Cloudinary: ${publicId}`);
      } catch (cloudinaryError) {
        console.error('Erreur lors de la suppression de l\'image sur Cloudinary:', cloudinaryError);
        // Ne pas arrêter le processus pour une erreur Cloudinary
      }
    }
    
    // Supprimer la formation
    const deleteResult = await Formation.findByIdAndDelete(id).session(session);
    
    if (!deleteResult) {
      throw new Error('Échec de la suppression de la formation');
    }
    
    // Valider la transaction
    await session.commitTransaction();
    session.endSession();
    
    return res.status(200).json({ 
      message: 'Formation supprimée avec succès.',
      details: {
        formationId: id,
        beneficiairesSupprimes: beneficiareDeleteResult.deletedCount
      }
    });
    
  } catch (error) {
    // Annuler la transaction en cas d'erreur
    await session.abortTransaction();
    session.endSession();
    
    console.error('Erreur complète:', error);
    
    return res.status(500).json({
      message: 'Erreur lors de la suppression de la formation',
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};
const getFormationsByManager = async (req, res) => {
  try {
    // 1. Get user ID from authentication
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ message: "Utilisateur non authentifié" });
    }

    // 2. Find the manager associated with this user
    const manager = await Manager.findOne({ utilisateur: userId });
    if (!manager) {
      return res.status(404).json({ message: "Manager non trouvé" });
    }

    // 3. Find all formateurs associated with this manager
    const formateurs = await Formateur.find({ manager: manager._id });
    if (!formateurs || formateurs.length === 0) {
      return res.status(404).json({ message: "Aucun formateur trouvé pour ce manager" });
    }

    // 4. Extract formateur IDs
    const formateurIds = formateurs.map(formateur => formateur._id);

    // 5. Find all formations associated with these formateurs
    const formations = await Formation.find({ formateur: { $in: formateurIds } })
      .populate({ path: 'formateur', populate: { path: 'utilisateur' } });

    // 6. Return the formations
    res.status(200).json(formations);
  } catch (error) {
    res.status(500).json({ 
      message: "Erreur lors de la récupération des formations par manager",
      error: error.message 
    });
  }
};

module.exports = {getFormationsByManager, createFormation, getAllFormations, GetOneFormation, UpdateFormation,DeleteFormation, getFormations };
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