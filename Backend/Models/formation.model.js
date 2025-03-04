const mongoose = require('mongoose');

const formationSchema = new mongoose.Schema({
  
  nom: { type: String, required: true },
  dateDebut: { type: Date, required: false },
  dateFin: { type: Date, required: false },
  description :{type:String,required:false,default:"Aucun description"},
  lienInscription: { type: String },
  status: { type: String, default: "Avenir", enum: ["En Cours", "Terminé", "Avenir", "Replanifier"] }, 
  tags: { type: String, required: false },
  tauxSatisfaction: { type: Number, min: 0, max: 100, required: false },
  formateur: { type: mongoose.Schema.Types.ObjectId, ref: "Formateur", required: true },
  // todo : définir les valeur de niveau et categorie
  categorie: { type: String, default: "type1", enum: ["type1", "type2", "type3"] }, 
  niveau:{type: String, default: "type1", enum: ["type1", "type2", "type3"] },
  image:{ type: String, required: false }
}, { timestamps: true });

module.exports = mongoose.model("Formation", formationSchema);
