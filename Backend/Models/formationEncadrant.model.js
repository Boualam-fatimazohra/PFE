const mongoose = require('mongoose');

const formationEncadrantSchema = new mongoose.Schema({
  formation: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "FormationBase", 
    required: true 
  },
  encadrant: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Encadrant", 
    required: true 
  },
  dateAssignment: {
    type: Date,
    default: Date.now
  }
}, { 
  timestamps: true 
});

// Create compound index for faster lookups and to ensure uniqueness
// of the formation-encadrant pair
formationEncadrantSchema.index({ formation: 1, encadrant: 1 }, { unique: true });

module.exports = mongoose.model("FormationEncadrant", formationEncadrantSchema);