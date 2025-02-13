const mongoose = require('mongoose');

const formateurSchema = new mongoose.Schema({
    utilisateur: { type: mongoose.Schema.Types.ObjectId, ref: "Utilisateur", required: true },
  }, { timestamps: true });

 const Formateur = mongoose.model("Formateur", formateurSchema);

 module.exports = Formateur;
 