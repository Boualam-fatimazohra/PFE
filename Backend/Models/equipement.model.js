const mongoose = require('mongoose');

const equipementSchema = new mongoose.Schema({
    nom: { 
        type: String, 
        required: true 
    },
    type: { 
        type: String, 
        required: true 
    },
    image: { 
        type: String, 
        required: false 
      },
    etat: { 
        type: String, 
        enum: ['disponible', 'en maintenance'], 
        default: 'disponible',
        required: true 
    },
    fab: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Fab", 
        required: true 
    }
}, { timestamps: true });

// Index pour optimiser les requêtes
equipementSchema.index({ fab: 1 });
equipementSchema.index({ etat: 1 });

const Equipement = mongoose.model("Equipement", equipementSchema);

module.exports = Equipement;