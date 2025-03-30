const mongoose = require('mongoose');

const formateurSchema = new mongoose.Schema({
    utilisateur: { type: mongoose.Schema.Types.ObjectId, ref: "Utilisateur", required: true },
    //todo : changer required from false to true 
    manager: { type: mongoose.Schema.Types.ObjectId, ref: "Manager", required: true },
    specialite: { type: String , required: true}, // Specialty field
    experience: { type: Number,required: true  }, // Experience in years or months
    dateIntegration: { type: Date, default: Date.now }, // Integration date with default value
    aPropos: { type: String ,required: true }, // About section
    cv: { type: String ,required: false }, // URL or path to CV file
    imageFormateur: { type: String, required: false },
  }, { timestamps: true });
 const Formateur = mongoose.model("Formateur", formateurSchema);

 module.exports = Formateur;
 
 