const Manager  = require("../Models/manager.model");
const { Utilisateur } = require("../Models/utilisateur.model");
const Coordinateur = require("../Models/coordinateur.model");
const bcrypt = require('bcryptjs');
const {UtilisateurEntity} = require('../Models/utilisateurEntity.js'); 
const { Entity } = require('../Models/entity.model.js'); 
const {sendMail} = require('../Config/auth.js');
const {mongoose} = require('mongoose');
const generateRandomPassword = require('../utils/generateRandomPassword.js');


const createCoordinateur = async (req, res) => {
   // Vérification des fichiers
    if (!req.files || !req.files['imageCoordinateur'] || !req.files['cv']) {
    return res.status(400).json({ 
      success: false,
      message: "L'image et le CV sont obligatoires" 
    });
  }
  try {
    const {
      nom,
      prenom,
      email,
      numeroTelephone,
      manager,
      entityId,
      specialite,
      experience,
      dateIntegration,
      aPropos
    } = req.body;
    // Vérification que l'ID est un ObjectId MongoDB valide
    if (!mongoose.Types.ObjectId.isValid(entityId)) {
      return res.status(400).json({
        success: false,
        message: "L'ID d'entité fourni n'est pas un ID MongoDB valide"
      });
    }
    const existingUser = await Utilisateur.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ 
        success: false,
        message: "Cet email est déjà utilisé" 
      });
    }

    // Gestion des autorisations par rôle
    const userRole = req.user?.role;
    let assignedManager;

    if (!userRole) {
      return res.status(403).json({ 
        success: false,
        message: "Accès refusé: Seuls les Admins ou Managers peuvent créer un Coordinateur" 
      });
    } else if (userRole === "Manager") {
      const managerDoc = await Manager.findOne({ utilisateur: req.user.userId });
      if (!managerDoc) {
        return res.status(400).json({ 
          success: false,
          message: "Manager non trouvé" 
        });
      }
      assignedManager = managerDoc._id;
    } else {
      if (!manager) {
        return res.status(400).json({ 
          success: false,
          message: "L'ID du Manager est obligatoire pour un Admin" 
        });
      }
      const managerDoc = await Manager.findById(manager);
      if (!managerDoc) {
        return res.status(400).json({ 
          success: false,
          message: "Manager non trouvé" 
        });
      }
      assignedManager = managerDoc._id;
    }

    // Vérification de l'entité
    const entity = await Entity.findById(entityId);
    if (!entity) {
      return res.status(400).json({ 
        success: false,
        message: "L'entité spécifiée n'existe pas" 
      });
    }

    // Génération du mot de passe temporaire
    const temporaryPassword = generateRandomPassword();
    const hashedPassword = await bcrypt.hash(temporaryPassword, 10);

    // Création du nouvel utilisateur
    const newUser = new Utilisateur({
      nom,
      prenom,
      email,
      numeroTelephone,
      password: hashedPassword,
      role: "Coordinateur",
    });

    // Envoi de l'email avec le mot de passe temporaire
    const contenu = `<p>Bonjour,</p>
                   <p>Votre compte coordinateur a été créé avec succès.</p>
                   <p>Votre mot de passe temporaire est : <b>${temporaryPassword}</b></p>
                   <p>Merci de ne pas le partager et de le changer après votre première connexion.</p>`;
    
    try {
      await sendMail(email, contenu);
      console.log(`Email envoyé à ${email} avec succès`);
    } catch (emailError) {
      console.error("Erreur lors de l'envoi de l'email:", emailError);
      // On continue malgré l'erreur d'envoi d'email
    }

    await newUser.save();

    // Création du coordinateur
    const newCoordinateur = new Coordinateur({
      utilisateur: newUser._id,
      manager: assignedManager,
      specialite,
      experience,
      dateIntegration: dateIntegration || Date.now(),
      aPropos,
      cv: req.files['cv'][0].path,
      imageCoordinateur: req.files['imageCoordinateur'][0].path
    });

    await newCoordinateur.save();

    // Association utilisateur-entité
    const utilisateurEntity = new UtilisateurEntity({
      id_utilisateur: newUser._id,
      id_entity: entityId,
    });

    await utilisateurEntity.save();

    res.status(201).json({
      success: true,
      message: "Coordinateur créé avec succès",
      data: {
        coordinateur: newCoordinateur,
        temporaryPasswordSent: true
      }
    });
  } catch (error) {
    console.error("Erreur création coordinateur:", error);
    
    res.status(500).json({
      success: false,
      message: "Erreur serveur",
      error: error.message
    });
  }
};

//  debut : Récupérer un coordinateur par son ID (fonctionnel)
const getCoordinateurById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "ID de coordinateur invalide"
      });
    }

    // Récupération avec population des relations
    const coordinateur = await Coordinateur.findById(id)
      .populate({
        path: 'utilisateur',
        select: '-password' // Exclure le mot de passe
      })
      .populate('manager');

    if (!coordinateur) {
      return res.status(404).json({
        success: false,
        message: "Coordinateur non trouvé"
      });
    }

    // Récupération de l'entité associée
    const utilisateurEntity = await UtilisateurEntity.findOne({
      id_utilisateur: coordinateur.utilisateur._id
    }).populate('id_entity');

    if (!utilisateurEntity?.id_entity) {
      return res.status(404).json({
        success: false,
        message: "Entité associée non trouvée"
      });
    }

    // Construction de la réponse
    const response = {
      ...coordinateur.toObject(),
      entity: utilisateurEntity.id_entity
    };

    res.status(200).json({
      success: true,
      data: response
    });

  } catch (error) {
    console.error("Erreur getCoordinateur:", error);
    res.status(500).json({
      success: false,
      message: "Erreur serveur",
      error: error.message
    });
  }
};
// fin : Récupérer un coordinateur par son ID 

// debut : Update a Coordinateur
const updateCoordinateur = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
 
    // Validation de l'ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "ID de coordinateur invalide"
      });
    }

    // Vérification des permissions
    const coordinateur = await Coordinateur.findById(id).populate('utilisateur');

    if (!coordinateur) {
      return res.status(404).json({
        success: false,
        message: "Coordinateur non trouvé"
      });
    }

    const userUpdates = ['nom', 'prenom', 'numeroTelephone'];
    userUpdates.forEach(field => {
      if (updates[field]) coordinateur.utilisateur[field] = updates[field];
    });

    await coordinateur.utilisateur.save();

    // Mise à jour du coordinateur
    const coordUpdates = ['specialite', 'experience', 'dateIntegration', 'aPropos', 'manager'];
    coordUpdates.forEach(field => {
      if (updates[field]) coordinateur[field] = updates[field];
    });
    if (req.files) {
        if (req.files['imageCoordinateur']) {
        coordinateur.imageCoordinateur = req.files['imageCoordinateur'][0].path;
      }
      if (req.files['cv']) {
        coordinateur.cv = req.files['cv'][0].path;
      }
    }

    // Gestion du changement d'entité
    if (updates.entityId) {
      if (!mongoose.Types.ObjectId.isValid(updates.entityId)) {
        return res.status(400).json({
          success: false,
          message: "ID d'entité invalide"
        });
      }

      const entity = await Entity.findById(updates.entityId);
      if (!entity) {
        return res.status(404).json({
          success: false,
          message: "Entité non trouvée"
        });
      }

      await UtilisateurEntity.updateOne(
        { id_utilisateur: coordinateur.utilisateur._id },
        { id_entity: updates.entityId }
      );
    }

    await coordinateur.save();

    // Récupération de la version mise à jour

    res.status(200).json({
      success: true,
      message: "Coordinateur mis à jour",
      
    });

  } catch (error) {
    console.error("Erreur updateCoordinateur:", error);
    res.status(500).json({
      success: false,
      message: "Erreur serveur",
      error: error.message
    });
  }
};
// fin : Update Coordinateur

// Delete a Coordinateur
const deleteCoordinateur = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "ID de coordinateur invalide"
      });
    }

    // Vérification de l'existence
    const coordinateur = await Coordinateur.findById(id).populate('utilisateur');
    if (!coordinateur) {
      return res.status(404).json({
        success: false,
        message: "Coordinateur non trouvé"
      });
    }

    // Suppression en cascade
    await Promise.all([
      UtilisateurEntity.deleteOne({ id_utilisateur: coordinateur.utilisateur._id }),
      Coordinateur.deleteOne({ _id: id }),
      Utilisateur.deleteOne({ _id: coordinateur.utilisateur._id })
    ]);

    res.status(200).json({
      success: true,
      message: "Coordinateur supprimé avec succès"
    });

  } catch (error) {
    console.error("Erreur deleteCoordinateur:", error);
    res.status(500).json({
      success: false,
      message: "Erreur serveur",
      error: error.message
    });
  }
};
const getAllCoordinateurs = async (req, res) => {
  try {
    // Fetch coordinateurs with populated utilisateur (excluding password) and manager
    const coordinateurs = await Coordinateur.find()
      .populate("utilisateur")
      .populate("manager");

    // Check if there are any coordinateurs
    if (!coordinateurs || coordinateurs.length === 0) {
      return res.status(404).json({ message: "No coordinateurs found" });
    }

    // Return coordinateurs
    res.status(200).json(coordinateurs);
  } catch (error) {
    res.status(500).json({ message: "Error fetching coordinateurs", error: error.message });
  }
};
module.exports = {
  createCoordinateur,
  getAllCoordinateurs,
  getCoordinateurById,
  updateCoordinateur,
  deleteCoordinateur
};
