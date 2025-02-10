const mongoose = require("mongoose");
/**
 * Schéma Utilisateur (hérite pour Manager, Formateur, Coordinateur)
 */
const utilisateurSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  prenom: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  telephone: { type: String, required: true },
  role: { type: String, enum: ["Manager", "Formateur", "Coordinateur"], required: true }
}, { timestamps: true });
export const Utilisateur = mongoose.model("Utilisateur", utilisateurSchema);