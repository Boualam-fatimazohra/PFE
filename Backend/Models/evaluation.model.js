const mongoose = require('mongoose');

const evaluationSchema = new mongoose.Schema({
    tauxSatisfaction: { 
        type: Number, 
        min: 0, 
        max: 100, 
        required: false  // Peut être optionnel selon tes besoins
    },
    lienEvaluation: { 
        type: String, 
        required: true,
        match: /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i // Vérification d'URL valide
    },
    questions: { 
        type: String,  // Si `questions` est censé être un tableau, mets `type: [String]`
        required: true 
    },
    formation: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Formation", 
        required: true 
    }
}, { timestamps: true });

// ✅ Définition unique du modèle
const Evaluation = mongoose.model("Evaluation", evaluationSchema);

// ✅ Exportation correcte
module.exports = Evaluation;
