const mongoose = require('mongoose');

/**
 * FormationFab Model
 * Extends FormationBase by adding a reference to it and additional Fab-specific fields
 */
const formationFabSchema = new mongoose.Schema({
  // Reference to the base formation
  baseFormation: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "FormationBase",
    required: true
  },
  
  status: { type: String, default: "Avenir", enum: ["En Cours", "Terminé", "Avenir", "Replanifier"] },
  categorie: { type: String, default: "type1", enum: ["type1", "type2", "type3"] }, 
  niveau:{type: String, default: "type1", enum: ["type1", "type2", "type3"] },
  tags: { type: String, required: false },
  tauxSatisfaction: { type: Number, min: 0, max: 100, required: false },
  lienInscription: { type: String },
}, { 
  timestamps: true 
});

// Create indexes for faster lookups
formationFabSchema.index({ baseFormation: 1 }, { unique: true });

module.exports = mongoose.model("FormationFab", formationFabSchema);
