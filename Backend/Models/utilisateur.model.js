const mongoose = require("mongoose");

const utilisateurSchema = new mongoose.Schema({
    nom: { type: String },
    prenom: { type: String },
    email: { type: String, required: true, unique: true },
    numeroTelephone: { type: String },
    password: { type: String, required: true },
    role: { type: String, enum: ["Manager", "Formateur", "Coordinateur"], required: true }
}, { timestamps: true });

const Utilisateur = mongoose.model("Utilisateur", utilisateurSchema);
module.exports = {Utilisateur};
