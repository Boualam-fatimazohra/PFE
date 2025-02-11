const mongoose = require('mongoose');

const formationSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  dateDebut: { type: Date, required: true },
  dateFin: { 
    type: Date, 
    required: true,
    validate: {
      validator: function(value) {
        // Ensure dateFin is after dateDebut
        return value > this.dateDebut;
      },
      message: 'dateFin must be after dateDebut'
    }
  },
  lienInscription: { type: String },
  tags: { type: String, required: true },
  tauxSatisfaction: { type: Number, min: 0, max: 100, required: false, default: null }, // optional with default null
  formateur: { type: mongoose.Schema.Types.ObjectId, ref: "Formateur", required: true },
  classes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Classe" }]
}, { timestamps: true });

module.exports = mongoose.model("Formation", formationSchema);
