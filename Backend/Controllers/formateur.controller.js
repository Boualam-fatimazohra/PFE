const Formateur = require("../Models/formateur.model.js");
const Formation = require("../Models/formation.model.js");
const Manager = require("../Models/manager.model.js");

const bcrypt = require('bcryptjs');
const { Utilisateur } = require('../Models/utilisateur.model.js');
const generateRandomPassword = require('../utils/generateRandomPassword.js');

const createFormateur = async (req, res) => {
    const { nom, prenom, email, numeroTelephone,coordinateur,manager} = req.body;
    try {
        // Vérification de l'existence de l'email
        const existingUser = await Utilisateur.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Cet email est déjà utilisé" });
        }
        // extraction du role de l'utilisateur
        const userRole = req.user?.role;
        console.log(userRole);
        let assignedManager;

        if (!userRole) {

            return res.status(403).json({ message: "Forbidden: Only Admins or Managers can create a Formateur (endpoint)" });

        } else if (userRole === "Manager") {
          console.log("le cas ou le mangaer qui tente de creer formateur");
            // Find the manager document using the user ID
            const managerDoc = await Manager.findOne({ utilisateur: req.user.userId });
            
            if (!managerDoc) {
                return res.status(400).json({ message: "Manager not found" });
            }
            assignedManager = managerDoc._id;
        } else {
            // Verify if the provided manager exists when Admin is creating
             if (!manager) {
               return res.status(400).json({ message: "Manager ID is required when Admin creates a Formateur" });
             }
             console.log("le cas ou l'admin qui tente de creer formateur");

             const managerDoc = await Manager.findById(manager);
            if (!managerDoc) {
                return res.status(400).json({ message: "Manager not found" });
            }
            assignedManager = managerDoc._id; // Use the Manager document ID, not
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
            role: "Formateur",
        });
          const contenu =`<p>Bonjour,</p>
                   <p>Votre mot de passe est : <b>${temporaryPassword}</b></p>
                   <p>Merci de ne pas le partager.</p>`;
        //await sendMail(email,contenu);
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
            .populate("manager") // Exemple de champs à afficher
            .populate("coordinateur");

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
// fin : 
  module.exports = { createFormateur, getFormateurs, getFormateurById, updateFormateur, deleteFormateur, GetFormateurFormations,getFormateurByManager,getFormations };
