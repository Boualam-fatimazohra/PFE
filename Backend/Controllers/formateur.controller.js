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
  const { nom, prenom, email, numeroTelephone, coordinateur, manager, entityId } = req.body; // Ajoutez entityId
  try {
      // Vérification de l'existence de l'email
      const existingUser = await Utilisateur.findOne({ email });
      if (existingUser) {
          return res.status(400).json({ message: "Cet email est déjà utilisé" });
      }

      // Extraction du rôle de l'utilisateur
      const userRole = req.user?.role;
      console.log(userRole);
      let assignedManager;

      if (!userRole) {
          return res.status(403).json({ message: "Forbidden: Only Admins or Managers can create a Formateur (endpoint)" });
      } else if (userRole === "Manager") {
          console.log("Le cas où le manager tente de créer un formateur");
          // Trouver le document du manager en utilisant l'ID de l'utilisateur
          const managerDoc = await Manager.findOne({ utilisateur: req.user.userId });
          if (!managerDoc) {
              return res.status(400).json({ message: "Manager not found" });
          }
          assignedManager = managerDoc._id;
      } else {
          // Vérifier si le manager est fourni lorsque l'admin crée un formateur
          if (!manager) {
              return res.status(400).json({ message: "Manager ID is required when Admin creates a Formateur" });
          }
          console.log("Le cas où l'admin tente de créer un formateur");

          const managerDoc = await Manager.findById(manager);
          if (!managerDoc) {
              return res.status(400).json({ message: "Manager not found" });
          }
          assignedManager = managerDoc._id; // Utiliser l'ID du document Manager
      }

      // Vérification si entityId est présent
      if (!entityId) {
          return res.status(400).json({ message: "L'ID de l'entité est requis" });
      }

      // Vérification si l'entité existe
      const entity = await Entity.findById(entityId);
      if (!entity) {
          return res.status(400).json({ message: "L'entité spécifiée n'existe pas" });
      }

      // Générer et hacher un mot de passe temporaire
      const temporaryPassword = generateRandomPassword();
      const hashedPassword = await bcrypt.hash(temporaryPassword, 10);

      // Créer un nouvel utilisateur
      const newUser = new Utilisateur({
          nom,
          prenom,
          email,
          numeroTelephone,
          password: hashedPassword,
          role: "Formateur",
      });

      const contenu = `<p>Bonjour,</p>
                      <p>Votre mot de passe est : <b>${temporaryPassword}</b></p>
                      <p>Merci de ne pas le partager.</p>`;
      // await sendMail(email, contenu);
      await newUser.save();

      // Créer un formateur lié au nouvel utilisateur
      const newFormateur = new Formateur({
          utilisateur: newUser._id,
          manager: assignedManager,
          coordinateur,
      });

      await newFormateur.save();

      // Créer l'association UtilisateurEntity
      const utilisateurEntity = new UtilisateurEntity({
          id_utilisateur: newUser._id,
          id_entity: entityId,
      });

      await utilisateurEntity.save();

      console.log("Email envoyé");

      res.status(201).json({
          message: "Formateur créé avec succès",
          user: newFormateur,
          entity: entity,
      });

  } catch (error) {
      console.error("Erreur:", error);
      // Rollback de la création de l'utilisateur en cas d'échec
      if (typeof newUser !== "undefined") {
          await Utilisateur.deleteOne({ _id: newUser._id });
      }
      res.status(500).json({
          message: "Erreur serveur",
          error: error.message,
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
    const id=req.params.id;
    try {
      const formateur = await Formateur.findById(id).populate("utilisateur", "nom   prenom  email  role").populate("manager").populate("coordinateur");
      if (!formateur) return res.status(404).json({ message: "Formateur non trouvé" });
      res.status(200).json(formateur);
    } catch (error) {
      res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
  };

  const updateFormateur = async (req, res) => {
    try {
      const { nom, prenom, email } = req.body;
  
      // Check if at least one field is provided
      if (!nom && !prenom && !email) {
        return res.status(400).json({ message: "At least one field is required for update." });
      }
  
      // Find the Formateur by ID
      const formateur = await Formateur.findById(req.params.id);
      if (!formateur) {
        return res.status(404).json({ message: "Formateur non trouvé" });
      }
  
      // Update the corresponding Utilisateur
      const updatedUtilisateur = await Utilisateur.findByIdAndUpdate(
        formateur.utilisateur, { nom,prenom, email },
        { new: true, runValidators: true } // Ensure updated data is returned and validated
      );
  
      res.status(200).json({
        message: "Formateur mis à jour avec succès",
        updatedUtilisateur
      });
  
    } catch (error) {
      res.status(500).json({ message: "Erreur serveur", error: error.message });
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
