const mongoose = require('mongoose');

const formateurSchema = new mongoose.Schema({
    utilisateur: { type: mongoose.Schema.Types.ObjectId, ref: "Utilisateur", required: true },
    //todo : changer required from false to true 
    manager: { type: mongoose.Schema.Types.ObjectId, ref: "Manager", required: true },
  }, { timestamps: true });
 const Formateur = mongoose.model("Formateur", formateurSchema);

 module.exports = Formateur;
 
 