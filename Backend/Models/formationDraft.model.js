const mongoose = require('mongoose');

const formationSchema = new mongoose.Schema({
  
  isDraft: { type: Boolean, default: true },
  currentStep: { type: Number, default: 2 },
  formation: { type: mongoose.Schema.Types.ObjectId, ref: "Formation", required: true },
}, { timestamps: true });

module.exports = mongoose.model("FormationDraft", formationSchema);
