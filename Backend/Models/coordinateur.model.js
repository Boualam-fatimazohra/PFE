const mongoose = require('mongoose');

const coordinateurSchema = new mongoose.Schema({
    utilisateur: { type: mongoose.Schema.Types.ObjectId, ref: "Utilisateur", required: true },
    manager: { type: mongoose.Schema.Types.ObjectId, ref: "Manager", required: true },
    
  }, { timestamps: true });
  
  module.exports = mongoose.model("Coordinateur", coordinateurSchema);
  
