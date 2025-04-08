const mongoose = require('mongoose');

const coordinateurSchema = new mongoose.Schema({
    utilisateur: { type: mongoose.Schema.Types.ObjectId, ref: "Utilisateur", required: true },
    manager: { type: mongoose.Schema.Types.ObjectId, ref: "Manager", required: true },
    specialite: { type: String , required: false}, // Specialty field
    experience: { type: Number,required: false  }, // Experience in years or months
    dateIntegration: { type: Date, default: Date.now }, // Integration date with default value
    aPropos: { type: String ,required: false }, // About section
    cv: { type: String ,required: false }, // URL or path to CV file
    imageFormateur: { type: String, required: false },
  }, { timestamps: true });
  
module.exports = mongoose.model("Coordinateur", coordinateurSchema);
  
