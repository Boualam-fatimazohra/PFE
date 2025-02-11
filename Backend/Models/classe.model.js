const mongoose = require('mongoose');

const classeSchema = new mongoose.Schema({
    formation: { type: mongoose.Schema.Types.ObjectId, ref: "Formation", required: true },  // Link to a single formation
    formateur: { type: mongoose.Schema.Types.ObjectId, ref: "Utilisateur", required: true },  // The teacher (formateur) of the class
}, { timestamps: true });

const Classe = mongoose.model("Classe", classeSchema);

module.exports = Classe;
