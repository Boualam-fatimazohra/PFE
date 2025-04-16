const { sendMail } = require('../Config/auth.js');
const Formateur = require("../Models/formateur.model.js");
const Formation = require("../Models/formation.model.js");
const Manager = require("../Models/manager.model.js");
const Coordinateur = require("../Models/coordinateur.model.js");
const Evenement=require("../Models/evenement.model.js");
const bcrypt = require('bcryptjs');
const { Utilisateur } = require('../Models/utilisateur.model.js');
const generateRandomPassword = require('../utils/generateRandomPassword.js');
const { Entity } = require('../Models/entity.model.js'); 
const {UtilisateurEntity} = require('../Models/utilisateurEntity.js'); 

const createFormateur = async (req, res) => {
  try {
    // Vérification des fichiers
    if (!req.files || !req.files['imageFormateur'] || !req.files['cv']) {
      return res.status(400).json({ 
        success: false,
        message: "L'image et le CV sont obligatoires" 
      });
    }

    const {
      nom,
      prenom,
      email,
      numeroTelephone,
      coordinateur,
      manager,
      entityId,
      specialite,
      experience,
      dateIntegration,
      aPropos
    } = req.body;

    // Extraction de l'ID d'entité si format "id-ville"
    let entityIdToUse = entityId;
    if (typeof entityId === 'string' && entityId.includes('-')) {
      entityIdToUse = entityId.split('-')[0];
    }

    // Vérification de l'existence de l'email
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
        message: "Accès refusé: Seuls les Admins ou Managers peuvent créer un Formateur" 
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
    const entity = await Entity.findById(entityIdToUse);
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
      role: "Formateur",
    });

    // Envoi de l'email avec le mot de passe temporaire
    const contenu = `<p>Bonjour,</p>
                   <p>Votre compte formateur a été créé avec succès.</p>
                   <p>Votre mot de passe temporaire est : <b>${temporaryPassword}</b></p>
                   <p>Merci de ne pas le partager et de le changer après votre première connexion.</p>`;
    await sendMail(email, contenu);
    await newUser.save();

    // Création du formateur avec les URLs des fichiers
    const newFormateur = new Formateur({
      utilisateur: newUser._id,
      manager: assignedManager,
      coordinateur,
      specialite,
      experience,
      dateIntegration: dateIntegration || Date.now(),
      aPropos,
      cv: req.files['cv'][0].path,
      imageFormateur: req.files['imageFormateur'][0].path
    });

    await newFormateur.save();

    // Association utilisateur-entité
    const utilisateurEntity = new UtilisateurEntity({
      id_utilisateur: newUser._id,
      id_entity: entityIdToUse,
    });

    await utilisateurEntity.save();

    res.status(201).json({
      success: true,
      message: "Formateur créé avec succès",
      data: {
        formateur: newFormateur,
        temporaryPasswordSent: true
      }
    });
  } catch (error) {
    console.error("Erreur création formateur:", error);
    
    // Gestion spécifique des erreurs Multer
    if (error.message.includes('Seuls les formats')) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }

    res.status(500).json({
      success: false,
      message: "Erreur serveur",
      error: error.message
    });
  }
};
// debut :pour récuperer tout les formateurs sans exception
const getFormateurs = async (req, res) => {
    try {
      const formateurs = await Formateur.find().populate("utilisateur", "nom  prenom  email  numeroTelephone  role").populate("manager").populate("coordinateur");
      res.status(200).json(formateurs);
    } catch (error) {
      res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
  };
  // fin :pour récuperer tout les formateurs sans exception
  // debut : pour récuperer les formateurs d'un manager
  const getFormateurByManager = async (req, res) => {
    const userId = req.user?.userId; // Supposons que req.user.userId est correctement défini
    if(!userId) return res.status(401).json({message:"Utilisateur non authentifié"});
    try {
      // chercher le manager associée a cet utilisateur
      const manager=await Manager.findOne({utilisateur:userId});
      if(!manager) return res.status(404).json({message:"Manager non trouvé"});
      const managerId=manager._id;
        //  Recherche des formateurs associés au manager
        const formateurs = await Formateur.find({ manager: managerId })
            .populate("utilisateur", "nom prenom email numeroTelephone role")
            .populate("manager"); // Exemple de champs à afficher
            

        //  Gestion du cas "Aucun résultat"
        if (formateurs.length === 0) {
            return res.status(200).json({ message: "Aucun formateur trouvé pour ce manager", data: [] });
        }

        //  Renvoi des données
        res.status(200).json({ data: formateurs });

    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
};
  // fin : pour récuperer les formateurs d'un manager
  const getFormateurById = async (req, res) => {
    const id = req.params.id;
    try {
        // 1. Récupérer le formateur avec les informations de base
        const formateur = await Formateur.findById(id)
            .populate({
                path: "utilisateur",
                select: "nom prenom email role numeroTelephone"
            })
            .populate("manager");

        if (!formateur) {
            return res.status(404).json({ message: "Formateur non trouvé" });
        }

        // 2. Récupérer l'entité associée à ce formateur
        const utilisateurEntity = await UtilisateurEntity.findOne({
            id_utilisateur: formateur.utilisateur._id
        }).populate("id_entity");

        // 3. Formater la réponse
        const response = {
            _id: formateur._id,
            utilisateur: {
                prenom: formateur.utilisateur.prenom,
                nom: formateur.utilisateur.nom,
                email: formateur.utilisateur.email,
                telephone: formateur.utilisateur.numeroTelephone,
                role: formateur.utilisateur.role
            },
            specialite: formateur.specialite,
            experience: formateur.experience,
            dateIntegration: formateur.dateIntegration,
            actif: formateur.actif,
            aPropos: formateur.aPropos,
            entity: utilisateurEntity ? {
                _id: utilisateurEntity.id_entity._id,
                type: utilisateurEntity.id_entity.type,
                ville: utilisateurEntity.id_entity.ville
            } : null,
            cv: formateur.cv,
            imageFormateur: formateur.imageFormateur
        };

        res.status(200).json(response);
    } catch (error) {
        console.error("Erreur lors de la récupération du formateur:", error);
        res.status(500).json({ 
            message: "Erreur serveur", 
            error: error.message 
        });
    }
};

  const updateFormateur = async (req, res) => {
    try {
      const { 
        nom, 
        prenom, 
        email,
        numeroTelephone,
        specialite,
        experience,
        dateIntegration,
        aPropos,
        entityId
      } = req.body;
  
      // Vérifier si au moins un champ est fourni
      if (Object.keys(req.body).length === 0 && !req.files) {
        return res.status(400).json({ 
          success: false,
          message: "Au moins un champ est requis pour la mise à jour" 
        });
      }
  
      // Trouver le formateur par ID
      const formateur = await Formateur.findById(req.params.id);
      if (!formateur) {
        return res.status(404).json({ 
          success: false,
          message: "Formateur non trouvé" 
        });
      }
  
      // Préparer les données à mettre à jour pour l'utilisateur
      const utilisateurUpdateData = {};
      if (nom) utilisateurUpdateData.nom = nom;
      if (prenom) utilisateurUpdateData.prenom = prenom;
      if (email) utilisateurUpdateData.email = email;
      if (numeroTelephone) utilisateurUpdateData.numeroTelephone = numeroTelephone;
  
      // Mettre à jour l'utilisateur si des champs sont fournis
      if (Object.keys(utilisateurUpdateData).length > 0) {
        await Utilisateur.findByIdAndUpdate(
          formateur.utilisateur,
          utilisateurUpdateData,
          { runValidators: true }
        );
      }
  
      // Préparer les données à mettre à jour pour le formateur
      const formateurUpdateData = {};
      if (specialite) formateurUpdateData.specialite = specialite;
      if (experience) formateurUpdateData.experience = experience;
      if (dateIntegration) formateurUpdateData.dateIntegration = dateIntegration;
      if (aPropos) formateurUpdateData.aPropos = aPropos;
  
      // Traiter les fichiers s'ils sont fournis
      if (req.files) {
        if (req.files['imageFormateur']) {
          formateurUpdateData.imageFormateur = req.files['imageFormateur'][0].path;
        }
        if (req.files['cv']) {
          formateurUpdateData.cv = req.files['cv'][0].path;
        }
      }
  
      // Mettre à jour le formateur uniquement si des champs à modifier sont fournis
      let updatedFormateur = formateur;
      if (Object.keys(formateurUpdateData).length > 0) {
        updatedFormateur = await Formateur.findByIdAndUpdate(
          req.params.id,
          formateurUpdateData,
          { new: true, runValidators: true }
        ).populate("utilisateur", "nom prenom email numeroTelephone role")
         .populate("manager");
      } else {
        // Si aucun champ du formateur n'a été modifié, récupérer la version à jour
        updatedFormateur = await Formateur.findById(req.params.id)
          .populate("utilisateur", "nom prenom email numeroTelephone role")
          .populate("manager");
      }
  
      // Mettre à jour l'entité associée si nécessaire
      if (entityId) {
        // Extraction de l'ID d'entité si format "id-ville"
        let entityIdToUse = entityId;
        if (typeof entityId === 'string' && entityId.includes('-')) {
          entityIdToUse = entityId.split('-')[0];
        }
  
        // Vérifier si l'entité existe
        const entity = await Entity.findById(entityIdToUse);
        if (!entity) {
          return res.status(400).json({ 
            success: false,
            message: "L'entité spécifiée n'existe pas" 
          });
        }
  
        // Mettre à jour ou créer l'association utilisateur-entité
        await UtilisateurEntity.findOneAndUpdate(
          { id_utilisateur: formateur.utilisateur },
          { id_entity: entityIdToUse },
          { upsert: true, new: true }
        );
      }
  
      res.status(200).json({
        success: true,
        message: "Formateur mis à jour avec succès",
        data: updatedFormateur
      });
  
    } catch (error) {
      console.error("Erreur mise à jour formateur:", error);
      
      // Gestion spécifique des erreurs Multer
      if (error.message && error.message.includes('Seuls les formats')) {
        return res.status(400).json({
          success: false,
          message: error.message
        });
      }
  
      res.status(500).json({
        success: false,
        message: "Erreur serveur",
        error: error.message
      });
    }
  };
  
  
  const deleteFormateur = async (req, res) => {
    try {
      // Vérification du manager
      // const managerId = req.user?.userId;
      // const managerRole = req.user?.role;
      // if (!managerId || managerRole !== "Manager") return res.status(403).json({ message: "Accès refusé." });
  
      const formateur = await Formateur.findById(req.params.id);
      if (!formateur) return res.status(404).json({ message: "Formateur non trouvé" });
  
      await Utilisateur.findByIdAndDelete(formateur.utilisateur);
      await Formateur.findByIdAndDelete(req.params.id);
      
      res.status(200).json({ message: "Formateur supprimé avec succès" });
    } catch (error) {
      res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
  };

  // debut : récupérer les formation d'un seule formateur 
 // debut : récupérer les formation d'un seule formateur 
 const GetFormateurFormations = async (req, res) => {
  try {
    // Get the formateur's ID from the request params
    const formateurId = req.params.id;

    // Check if formateurId is provided
    if (!formateurId) {
      return res.status(400).json({ message: "Aucun identifiant de formateur fourni" });
    }

    // Find the formateur using the ID
    const formateur = await Formateur.findById(formateurId);

      //  Renvoi des données
      res.status(200).json({ data: formateurs });

    // Find formations linked to this formateur
    const formations = await Formation.find({ formateur: formateur._id });

    // Check if formations array is empty
    if (formations.length === 0) {
      return res.status(200).json({ message: "Aucune formation disponible pour ce formateur." });
    }

    // Return formations (empty array if none found)
    res.status(200).json(formations);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération des formations", error: error.message });
  }
};
// debut :
// Get Formations of connected formateur
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
const getNbrEvenementsAssocies = async (req, res) => {
  try {
    const { userId, role } = req.user;
    const currentDate = new Date();

    if (role !== 'Formateur') {
      return res.status(403).json({ message: 'Accès réservé aux formateurs' });
    }
    
    // 1. Récupération du formateur et vérification
    const formateur = await Formateur.findOne({ utilisateur: userId });
    
    if (!formateur) {
      return res.status(404).json({ message: ' non trouvé pour  formateur' });
    }
    // 3. Construction de la liste des IDs utilisateurs autorisés
    const organisateursIds = [userId]; // ID utilisateur du formateur
    // 4. Requête des événements avec le nouveau schéma
    const evenements = await Evenement.find({
      organisateur: { $in: organisateursIds },
      dateDebut: { $gte: currentDate },
      // isValidate: true 
    })
    .sort({ dateDebut: 1 });

    // 5. Formatage de la réponse
    const response = {
      count: evenements.length,
      prochainEvenement: evenements[0] ? {
        titre: evenements[0].titre,
        date: evenements[0].dateDebut,
        heure: evenements[0].heureDebut
      } : null
    };

    res.status(200).json(response);

  } catch (error) {
    console.error('Erreur lors de la récupération des événements:', error);
    res.status(500).json({ 
      message: 'Erreur serveur', 
      error: error.message 
    });
  }
};
// fin : 
  module.exports = {getNbrEvenementsAssocies,createFormateur, getFormateurs, getFormateurById, updateFormateur, deleteFormateur, GetFormateurFormations,getFormateurByManager,getFormations };
