
const mongoose = require('mongoose');

const ficheProjetSchema = new mongoose.Schema({
    idEvenement: { ref: "Evenement", type: mongoose.Schema.Types.ObjectId, required: true },
    
  }, { timestamps: true });

module.exports = mongoose.model("FicheProjet", ficheProjetSchema);
