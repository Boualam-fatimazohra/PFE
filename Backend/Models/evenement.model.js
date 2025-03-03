const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const evenementSchema = new Schema({
  dateDebut: { type: Date, required: true },
  dateFin: { type: Date, required: true },
  heureDebut: { type: String, required: true },
  heureFin: { type: String, required: true },
  sujet: { type: String, required: true },
  
  // Référence polymorphe (XOR)
  organisateurType: {
    type: String,
    required: true,
    enum: ['Formateur', 'Coordinateur']
  },
  organisateur: {
    type: Schema.Types.ObjectId,
    required: true,
    refPath: 'organisateurType'
  }
}, { 
  timestamps: true // Activation des champs createdAt et updatedAt
});

module.exports = mongoose.model('Evenement', evenementSchema);