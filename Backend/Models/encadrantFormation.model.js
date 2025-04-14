const mongoose = require('mongoose');

/**
 * EncadrantFormation Model
 * Represents the many-to-many relationship between Encadrants and FormationBase
 */
const encadrantFormationSchema = new mongoose.Schema({
  // Reference to Encadrant
  encadrant: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Encadrant", 
    required: true 
  },
  
  // Reference to FormationBase
  formationBase: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "FormationBase", 
    required: true 
  },
  
  // Date when the encadrant was assigned to the formation
  dateAssignment: {
    type: Date,
    default: Date.now
  },

  
}, { 
  timestamps: true 
});

// Create a compound index to ensure an encadrant can only be assigned once 
// with a specific role to a formation
encadrantFormationSchema.index(
  { encadrant: 1, formationBase: 1 }, 
  { unique: true }
);

// Create additional indexes for common queries
encadrantFormationSchema.index({ encadrant: 1 });
encadrantFormationSchema.index({ formationBase: 1 });

module.exports = mongoose.model("EncadrantFormation", encadrantFormationSchema);