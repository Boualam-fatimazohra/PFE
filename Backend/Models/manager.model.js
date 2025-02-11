const mongoose = require('mongoose');
const Utilisateur = require('./Utilisateur'); 

const managerSchema = new mongoose.Schema({
    utilisateur: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Utilisateur", 
        required: true,
        validate: {
            validator: async function(value) {
                // Check if the referenced utilisateur exists and if the role is 'Manager'
                const utilisateur = await Utilisateur.findById(value);
                return utilisateur && utilisateur.role === 'Manager'; 
            },
            message: 'Invalid utilisateur reference or the utilisateur is not a Manager.'
        }
    },
    formateurs: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Utilisateur",
        validate: {
            validator: function(value) {
                return Array.isArray(value) && value.every(item => mongoose.Types.ObjectId.isValid(item));
            },
            message: 'Each formateur must be a valid ObjectId reference to an Utilisateur.'
        }
    }],
    coordinateurs: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Utilisateur", 
        required: true,
        validate: {
            validator: function(value) {
                return Array.isArray(value) && value.every(item => mongoose.Types.ObjectId.isValid(item));
            },
            message: 'Each coordinateur must be a valid ObjectId reference to an Utilisateur.'
        }
    }]
}, { timestamps: true });

const Manager = mongoose.model("Manager", managerSchema);

module.exports = { Manager };
