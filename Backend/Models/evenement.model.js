const mongoose = require('mongoose');  // Ajoutez cette ligne
const Schema = mongoose.Schema;     
const evenementSchema = new Schema({
  dateDebut: { type: Date, required: true },
  dateFin: { type: Date, required: true }, 
  heureDebut: { type: String, required: true },
  heureFin: { type: String, required: true },
  titre: { type: String, required: true },
  description: { type: String, required: false },
  createdBy: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "Utilisateur"
  },
  organisateur: {
    type: Schema.Types.ObjectId,
    required: false,
    ref: "Utilisateur" 
  },
  isValidate: { type: Boolean, default: false },
  categorie: { type: String, required: false },
  participants: [{
    type: Schema.Types.ObjectId,
    ref: "Utilisateur",
    validate: {
      validator: function(v) {
        return mongoose.Types.ObjectId.isValid(v);
      },
      message: props => `${props.value} n'est pas un ID utilisateur valide`
    }
  }],
  Parametre: { 
    type: String,
    enum: ['Public', 'Priver'],
    default: 'Public'
  }
}, { 
  timestamps: true
});
const Evenement = mongoose.model('Evenement', evenementSchema); // Définition du modèle
module.exports = Evenement; // Exportation du modèle
