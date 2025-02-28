const mongoose = require("mongoose");

const utilisateurSchema = new mongoose.Schema({
    nom: { type: String },
    prenom: { type: String },
    email: { type: String, required: true, unique: true },
    numeroTelephone: { type: String },
    password: { type: String, required: true },
    role: { type: String, enum: ["Admin", "Manager", "Formateur", "Coordinateur"], required: true },
    resetPasswordCode:{type:String,required:false},
    resetPasswordExpires:{type:Date,required:false}
}, { timestamps: true });

const Utilisateur = mongoose.model("Utilisateur", utilisateurSchema);
module.exports = {Utilisateur};