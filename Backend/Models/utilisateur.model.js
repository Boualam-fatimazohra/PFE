const mongoose = require("mongoose");

const utilisateurSchema = new mongoose.Schema({
    firstName: { type: String },
    lastName: { type: String },
    email: { type: String, required: true, unique: true },
    phoneNumber: { type: String },
    password: { type: String, required: true },
    role: { type: String, enum: ["Manager", "Formateur", "Coordinateur"], required: true }
}, { timestamps: true });

const Utilisateur = mongoose.model("Utilisateur", utilisateurSchema);
module.exports = {Utilisateur};
