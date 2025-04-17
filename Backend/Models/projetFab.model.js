const mongoose = require('mongoose');


const projetFabSchema = new mongoose.Schema({

    baseFormation: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "FormationBase",
    required: true
    },

    // Attribut status avec enum
    status: {
    type: String,
    default: "Avenir",
    enum: ["En Cours", "Terminé", "Avenir", "Replanifier"]
    },

    // Progression en pourcentage
    progress: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
    },

    // Nombre de participants
    nombreParticipants: {
    type: Number,
    default: 0,
    min: 0
    }
});

// Utiliser la technique de discrimination pour l'héritage dans MongoDB
projetFabSchema.index({ baseFormation: 1 }, { unique: true });

module.exports = mongoose.model("ProjetFab", projetFabSchema);