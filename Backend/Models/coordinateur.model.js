const mongoose = require('mongoose');

const coordinateurSchema = new mongoose.Schema({
    utilisateur: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Utilisateur", 
        required: [true, 'Utilisateur is required'],  // Custom error message for required validation
        validate: {
            validator: async function(value) {
                // Optional: check if the utilisateur has a specific role
                const utilisateur = await mongoose.model('Utilisateur').findById(value);
                return utilisateur && utilisateur.role === 'Coordinateur';  // Ensuring the user is a "Coordinateur"
            },
            message: 'Utilisateur must be a Coordinateur'
        }
    }
}, { timestamps: true });

// Create the Coordinateur model
const Coordinateur = mongoose.model("Coordinateur", coordinateurSchema);

module.exports = { Coordinateur };
