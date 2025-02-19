const Formateur = require("../Models/formateur.model.js");
const Formation = require("../Models/formation.model.js");

const bcrypt = require('bcryptjs');
const { Utilisateur } = require('../Models/utilisateur.model.js');
const { sendMail } = require('../Config/auth.js');
const generateRandomPassword = require('../utils/generateRandomPassword.js');

const createFormateur = async (req, res) => {
    const { nom, prenom, email, numeroTelephone, password, coordinateur, manager } = req.body;

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
            assignedManager = manager; // Use manager from request body if Admin
        }

        // Generate and hash a temporary password
        const temporaryPassword = generateRandomPassword();
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = new Utilisateur({
            nom,
            prenom,
            email,
            numeroTelephone,
            password: hashedPassword,
            role: "Formateur"
        });

        await sendMail(email, temporaryPassword);
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
  
  module.exports = { createFormateur, getFormateurs, getFormateurById, updateFormateur, deleteFormateur };