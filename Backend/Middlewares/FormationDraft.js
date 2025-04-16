const FormationDraft = require("../Models/formationDraft.model.js");
const mongoose = require('mongoose');

const checkFormationDraft = async (req, res, next) => {
    try {
        const { id } = req.params;
        
        // Vérifier si l'ID est valide
        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "ID de formation invalide" });
        }
        
        // Rechercher le brouillon de formation
        const formationDraft = await FormationDraft.findOne({ formation: id });
        
        // Si aucun brouillon n'est trouvé
        if (!formationDraft) {
            return res.status(404).json({ message: "Aucun brouillon de formation trouvé" });
        }
        
        // Vérifier si c'est un brouillon
        if (formationDraft.isDraft === true) {
            console.log("Passage réussi dans le middleware checkFormationDraft");
            return next();
        } else {
            // Gérer le cas où isDraft est false
            return res.status(403).json({ message: "Cette formation n'est pas un brouillon" });
        }
    } catch (error) {
        console.error("Erreur dans le middleware checkFormationDraft:", error);
        return res.status(500).json({ 
            message: "Erreur serveur lors de la vérification du brouillon de formation",
            error: error.message 
        });
    }
};

module.exports = checkFormationDraft;