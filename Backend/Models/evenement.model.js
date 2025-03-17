const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const evenementSchema = new Schema({
  dateDebut: { type: Date, required: true },
  dateFin: { type: Date, required: true }, 
  heureDebut: { type: String, required: true },
  heureFin: { type: String, required: true },
  titre: { type: String, required: true },
  description :{type:String,required:false},
  createdBy: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "Utilisateur"
  },
  organisateur: {
    type: Schema.Types.ObjectId,
    required:false,
    ref: "Utilisateur" 
  },
  isValidate:{type:Boolean,default: false },
  categorie:{type: String,required:false},
}, { 
  timestamps: true // Activation des champs createdAt et updatedAt
});
module.exports = mongoose.model('Evenement', evenementSchema);