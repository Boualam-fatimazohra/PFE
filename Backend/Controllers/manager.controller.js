const Manager = require("../Models/manager.model");
const bcrypt = require('bcryptjs');
const { Utilisateur } = require("../Models/utilisateur.model");
const generateRandomPassword = require("../utils/generateRandomPassword.js");
const {getEvenementByMonth} =require("../Controllers/evenement.controller.js")
// Create a new Manager
const createManager = async (req, res) => {
    try {
        const { nom,prenom, email, numeroTelephone ,password} = req.body;
        if (!email ) {
            return res.status(400).json({ message: "Email, password" });
        }
        /*if (role !== "Manager") {
            return res.status(400).json({ message: "Role must be 'Manager'" });
        }*/
        const existingUser = await Utilisateur.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Utilisateur with this email already exists" });
        }
        // const temporaryPassword = generateRandomPassword();
        const hashedPassword = await bcrypt.hash(password, 10);
        /* await sendMail(email,temporaryPassword);*/

        const newUtilisateur = new Utilisateur({
            nom,
            prenom,
            email,
            numeroTelephone,
            password: hashedPassword,
            role: "Manager"
        });
        await newUtilisateur.save();
        // Create the manager entry with the utilisateur
        const newManager = new Manager({ utilisateur: newUtilisateur._id });
        await newManager.save();

        res.status(201).json({
            message: "Manager created successfully",
            manager: newManager,
            utilisateur: newUtilisateur
        });
    } catch (error) {
        res.status(500).json({ message: "Error creating manager", error: error.message });
    }
};

// Get all Managers
const getManagers = async (req, res) => {
    try {
        const managers = await Manager.find().populate("utilisateur");
        if (managers.length === 0) {
            return res.status(404).json({ message: "No managers found" });
        }
        res.status(200).json(managers);
    } catch (error) {
        res.status(500).json({ message: "Error retrieving managers", error: error.message });
    }
};

// Get Manager by ID
const getManagerById = async (req, res) => {
    try {
        const { id } = req.params;
        const manager = await Manager.findById(id).populate("utilisateur");

        if (!manager) {
            return res.status(404).json({ message: "Manager not found" });
        }

        res.status(200).json(manager);
    } catch (error) {
        res.status(500).json({ message: "Error retrieving manager", error: error.message });
    }
};

const updateManager = async (req, res) => {
    try {
        const { id } = req.params;
        const { nom, prenom, email, numeroTelephone, password } = req.body;

        const existingManager = await Manager.findById(id);
        if (!existingManager) {
            return res.status(404).json({ message: "Manager not found" });
        }

        // Create an update object
        const updateData = {
            nom,
            prenom,
            email,
            numeroTelephone
        };

        // Only add password to update if it exists
        if (password) {
            // Hash password with salt rounds of 10
            updateData.password = await bcrypt.hash(password, 10);
        }

        const updatedUtilisateur = await Utilisateur.findByIdAndUpdate(
            existingManager.utilisateur,
            updateData,
            { new: true }
        );

        if (!updatedUtilisateur) {
            return res.status(500).json({ message: "Error updating utilisateur" });
        }

        // Respond with updated manager information
        res.status(200).json({
            message: "Manager updated successfully",
            manager: existingManager,
            utilisateur: updatedUtilisateur
        });
    } catch (error) {
        res.status(500).json({ message: "Error updating manager", error: error.message });
    }
};

// Delete Manager
const deleteManager = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedManager = await Manager.findByIdAndDelete(id);

        if (!deletedManager) {
            return res.status(404).json({ message: "Manager not found" });
        }

        // Delete associated utilisateur
        await Utilisateur.findByIdAndDelete(deletedManager.utilisateur);

        res.status(200).json({ message: "Manager and associated utilisateur deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting manager", error: error.message });
    }
};
//todo : la fct getManagerStatistique n'est pas encore fonctionnel 
// const getManagerStatistique = async (req, res) => {
//     try {
//       const { month } = req.body;
//       // Récupération des stats d'événements
//       const eventStats = await getEvenementByMonth(month);
//       // Structure de réponse extensible
//       const stats = {
//         evenements: eventStats,
//         // d'autres statistiques ici plus tard
//       };
//       res.status(200).json({
//         success: true,
//         stats
//       });
//     } catch (error) {
//         console.log("erreur from getManagerStatistique");

//       res.status(500).json({
//         success: false,
//         message: error.message || "Erreur lors de la collecte des statistiques"
//       });
//     }
//   };

module.exports = {
    createManager,
    getManagers,
    getManagerById,
    updateManager,
    deleteManager,
    // getManagerStatistique
};
