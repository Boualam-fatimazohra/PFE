const Formateur=require("../Models/formateur.model.js");
const Formation=require("../Models/formation.model.js");

const crypto = require('crypto');
const bcrypt = require('bcrypt');
const { Utilisateur } = require('../Models/utilisateur.model.js');

// Fonction pour générer un mot de passe aléatoire
const generateRandomPassword = (length = 12) => {
  return crypto.randomBytes(Math.ceil(length / 2))
    .toString('hex')
    .slice(0, length);
};

const createFormateur = async (req, res) => {
    
    const { firstName, lastName, email} = req.body;
    
    try {
        // Vérification de l'authentification et des autorisations
        // const managerId = req.user?.userId;
        // const managerRole = req.user?.role;

        // if (!managerId) {
        //     return res.status(401).json({ message: "Utilisateur non authentifié" });
        // }

        // if (managerRole !== "Manager") {
        //     return res.status(403).json({ message: "Accès refusé. Réservé aux managers." });
        // }

        // Vérification de l'existence de l'email
        const existingUser = await Utilisateur.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Cet email est déjà utilisé" });
        }

        // Génération du mot de passe temporaire
        const temporaryPassword = generateRandomPassword();
        const hashedPassword = await bcrypt.hash(temporaryPassword, 10);

        // Création de l'utilisateur
        const newUser = new Utilisateur({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            role: "Formateur"
        });

        await newUser.save();

        // Création du formateur lié
        const newFormateur = new Formateur({
            utilisateur: newUser._id
        });

        await newFormateur.save();

        // Préparation de la réponse
        const userResponse = {
            _id: newUser._id,
            firstName: newUser.firstName,
            lastName: newUser.lastName,
            email: newUser.email,
            role: newUser.role,
            phoneNumber: newUser.phoneNumber
        };

        res.status(201).json({ 
            message: "Formateur créé avec succès",
            user: userResponse,
            temporaryPassword: temporaryPassword // Envoyer le mot de passe non hashé
        });

    } catch (error) {
        console.error("Erreur:", error);
        
        // Nettoyage en cas d'erreur après création utilisateur
        if (newUser) {
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
      const formateurs = await Formateur.find().populate("utilisateur", "firstName lastName email  phoneNumber role");
      res.status(200).json(formateurs);
    } catch (error) {
      res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
  };
//   firstName: { type: String },
    // lastName: { type: String },
    // email: { type: String, required: true, unique: true },
    // phoneNumber: { type: String },
  
  const getFormateurById = async (req, res) => {
    const id=req.params.id;
    try {
      const formateur = await Formateur.findById(id).populate("utilisateur", "firstName lastName email role");
      if (!formateur) return res.status(404).json({ message: "Formateur non trouvé" });
      res.status(200).json(formateur);
    } catch (error) {
      res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
  };
  
  const updateFormateur = async (req, res) => {
    const { firstName, lastName, email } = req.body;
    try {
      // Vérification du manager
      // const managerId = req.user?.userId;
      // const managerRole = req.user?.role;
      // if (!managerId || managerRole !== "Manager") return res.status(403).json({ message: "Accès refusé." });
       
      const formateur = await Formateur.findById(req.params.id);
      if (!formateur) return res.status(404).json({ message:"Formateur non trouvé" });
      
      await Utilisateur.findByIdAndUpdate(formateur.utilisateur,{ firstName, lastName, email });
      res.status(200).json({ message: "Formateur mis à jour avec succès" });
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