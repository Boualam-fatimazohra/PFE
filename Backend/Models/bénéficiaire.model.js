
const mongoose = require('mongoose');

const beneficiaireSchema = new mongoose.Schema({
    nom: { type: String, required: true },
    prenom: { type: String, required: true },
    dateNaissance: { type: Date, required: true },
    niveau: { type: String, required: true },
    isBlack: { type: Boolean, default: false },
    isSuturate: { type: Boolean, default: false }
  }, { timestamps: true });
  export const Beneficiaire = mongoose.model("Beneficiaire", beneficiaireSchema);
  