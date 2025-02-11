const mongoose = require('mongoose');

const formationSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  dateDebut: { type: Date, required: true },
  dateFin: { type: Date, required: true },
  lienInscription: { type: String },
  tags: { type: String, required: true },
  tauxSatisfaction: { type: Number, min: 0, max: 100,required: false },
  formateur: { type: mongoose.Schema.Types.ObjectId, ref: "Formateur", required: true },
  classes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Classe" }]
}, { timestamps: true });

module.exports = mongoose.model("Formation", formationSchema);
