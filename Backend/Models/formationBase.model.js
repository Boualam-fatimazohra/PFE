const mongoose = require('mongoose');

const formationBaseSchema = new mongoose.Schema({
  nom: { 
    type: String, 
    required: true 
  },
  dateDebut: { 
    type: Date, 
    required: true 
  },
  dateFin: { 
    type: Date, 
    required: true 
  },
  description: {
    type: String,
    required: false,
    default: "Aucune description"
  },
  image: { 
    type: String, 
    required: false 
  }
}, { 
  timestamps: true 
});

// Create an index for faster lookups by name
formationBaseSchema.index({ nom: 1 });

module.exports = mongoose.model("FormationBase", formationBaseSchema);