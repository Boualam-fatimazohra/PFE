const mongoose = require('mongoose');

const formationSchema = new mongoose.Schema({
  
  nom: { type: String, required: true },
  dateDebut: { type: Date, required: true },
  dateFin: { type: Date, required: true },
  lienInscription: { type: String },
  status: { type: String, default: "En Cours", enum: ["En Cours", "Terminé", "Replanifié"] }, // Fixed enum values spelling
  tags: { type: String, required: true },
  tauxSatisfaction: { type: Number, min: 0, max: 100, required: false },
  formateur: { type: mongoose.Schema.Types.ObjectId, ref: "Formateur", required: true },
  classes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Classe" }],
  image: { type: String, required: false }
}, { timestamps: true });

module.exports = mongoose.model("Formation", formationSchema);
