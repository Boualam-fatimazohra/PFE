const mongoose = require('mongoose');

const encadrantSchema = new mongoose.Schema({
    // Reference to Utilisateur model for personal information
    utilisateur: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Utilisateur", 
        required: true 
    },
    
    type: { 
        type: String, 
        enum: ['Interne', 'Externe'], 
        required: true 
    },

    specialite: { 
        type: String, 
        required: false 
    },
    
    disponibilite: { 
        type: String, 
        required: false 
    },
}, { 
    timestamps: true 
});

// Create index for faster lookup
encadrantSchema.index({ utilisateur: 1 }, { unique: true });

const Encadrant = mongoose.model("Encadrant", encadrantSchema);

module.exports = Encadrant;