const mongoose = require('mongoose');

const formationFabSchema = new mongoose.Schema({
  baseFormation: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "FormationBase",
    required: true
  },
  
  status: { 
    type: String, 
    required: true,
    enum: ["En Cours", "Terminé", "Avenir", "Replanifier"],
    default: "Avenir" 
  },
  
  categorie: { 
    type: String, 
    required: true,
    enum: ["Dev", "type2", "type3"], // Correspondre aux options du frontend
    default: "Dev" 
  },
  
  niveau: {
    type: String, 
    required: true,
    enum: ["Débutant", "Intermédiaire", "Avancé", "Expert", "Moyen"],
    default: "Débutant"
  },
  
  tags: { 
    type: String, 
    required: false 
  },
  
  tauxSatisfaction: { 
    type: Number, 
    min: 0, 
    max: 100, 
    default: 0 
  },
  
  lienInscription: { 
    type: String, 
    required: true 
  }
  
}, { 
  timestamps: true 
});