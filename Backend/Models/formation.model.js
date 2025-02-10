const mongoose = require('mongoose');
// const Formateur = require("./formateur.model"); // Import nécessaire
// const Classe = require("./classe.model"); // Import nécessaire

const formationSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  dateDebut: { type: Date, required: true },
  dateFin: { type: Date, required: true },
  lienInscription: { type: String },
  status: { type: String, enum: ["Ouverte", "Fermée"], required: true },
  tauxSatisfaction: { type: Number, min: 0, max: 100 },
  formateur: { type: mongoose.Schema.Types.ObjectId, ref: "Formateur", required: true },
  classes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Classe" }]
}, { timestamps: true });
export const Formation = mongoose.model("Formation", formationSchema);
