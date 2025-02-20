const Formateur = require("../Models/formateur.model.js");
const Formation = require("../Models/formation.model.js");
const Manager = require("../Models/manager.model.js");

const bcrypt = require('bcryptjs');
const { Utilisateur } = require('../Models/utilisateur.model.js');
const { sendMail } = require('../Config/auth.js');
const generateRandomPassword = require('../utils/generateRandomPassword.js');

const createFormateur = async (req, res) => {
    const { nom, prenom, email, numeroTelephone,coordinateur, manager } = req.body;

    try {
        // Vérification de l'existence de l'email
        const existingUser = await Utilisateur.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Cet email est déjà utilisé" });
        }

        const userRole = req.user?.role;
        console.log(userRole);
        let assignedManager;

        if (!userRole) {
            return res.status(403).json({ message: "Forbidden: Only Admins or Managers can create a Formateur (endpoint)" });
        } else if (userRole === "Manager") {
            assignedManager = req.user.userId; // Assign Manager's ID
        } else {
            // Verify if the provided manager exists when Admin is creating
            if (!manager) {
              return res.status(400).json({ message: "Manager ID is required when Admin creates a Formateur" });
            }
            
            const managerExists = await Manager.findOne({ utilisateur: manager });
            if (!managerExists) {
                return res.status(400).json({ message: "Specified manager does not exist" });
            }
            
            assignedManager = manager;
        }

        // Generate and hash a temporary password
        const temporaryPassword = generateRandomPassword();
        const hashedPassword = await bcrypt.hash(temporaryPassword, 10);
        
        // Create new user
        const newUser = new Utilisateur({
            nom,
            prenom,
            email,
            numeroTelephone,
            password: hashedPassword,
            role: "Formateur"
        });
          const contenu =`<p>Bonjour,</p>
                   <p>Votre mot de passe est : <b>${temporaryPassword}</b></p>
                   <p>Merci de ne pas le partager.</p>`;
        await sendMail(email,contenu);
        await newUser.save();

        // Create Formateur linked to the new user
        const newFormateur = new Formateur({
            utilisateur: newUser._id,
            manager: assignedManager, 
            coordinateur
        });

        await newFormateur.save();
        console.log("Email envoyé");

        res.status(201).json({ 
            message: "Formateur créé avec succès",
            user: newFormateur,
        });

    } catch (error) {
        console.error("Erreur:", error);
        
        // Rollback user creation if something fails
        if (typeof newUser !== "undefined") {
            await Utilisateur.deleteOne({ _id: newUser._id });
        }

        res.status(500).json({ 
            message: "Erreur serveur",
            error: error.message 
        });
    }
};



const getFormateurs = async (req, res) => {
    try {
      const formateurs = await Formateur.find().populate("utilisateur", "nom  prenom  email  numeroTelephone  role").populate("manager").populate("coordinateur");
      res.status(200).json(formateurs);
    } catch (error) {
      res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
  };

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
const GetFormateurFormations = async (req, res) => {
  try {
    // Get the mentor's userId from the cookie
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ message: "Utilisateur non authentifié" });
    }

    // Find the formateur using the userId (utilisateur)
    const formateur = await Formateur.findOne({ utilisateur: userId });

    // Check if the formateur exists
    if (!formateur) {
      return res.status(404).json({ message: "Formateur non trouvé" });
    }

    // Find the formations by formateur ID (this will be the formateur reference in the 'Formation' schema)
    const formations = await Formation.find({ formateur: formateur._id });

    // Check if formations are found
    if (formations.length === 0) {
      return res.status(404).json({ message: "Aucune formation trouvée pour ce formateur" });
    }

    // Return the formations associated with the formateur
    res.status(200).json(formations);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des formations', error: error.message });
  }
};
  
  module.exports = { createFormateur, getFormateurs, getFormateurById, updateFormateur, deleteFormateur, GetFormateurFormations };