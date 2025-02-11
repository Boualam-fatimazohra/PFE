const mongoose = require('mongoose');

const formateurSchema = new mongoose.Schema({
    utilisateur: { type: mongoose.Schema.Types.ObjectId, ref: "Utilisateur", required: true },
    formations: [{ type: mongoose.Schema.Types.ObjectId, ref: "Formation" }]
  }, { timestamps: true });
 const Formateur = mongoose.model("Formateur", formateurSchema);
 module.exports = {Formateur};