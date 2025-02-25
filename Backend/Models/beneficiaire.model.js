
const mongoose = require('mongoose');

const beneficiaireSchema = new mongoose.Schema({
    nom: { type: String, required: true },
    prenom: { type: String, required:false },
    dateNaissance: { type: Date, required:false},
    email:{type:String,required:true},
    genre :{type:String,required:true},
    pays:{type:String,required:true},
    niveau: { type: String, required:false,enum :["bac","bac+2","bac+3","bac+5"] },
    specialite: {type:String,required:false},
    etablissement:{type:String,required:false},
    profession:{type:String,required:false,enum:["Sans Emploi","Avec Emploi","Etudiant"]},
    isBlack: { type: Boolean, default: false },
    isSaturate: { type: Boolean, default: false },
    nationalite: {type:String,required:false},
  }, { timestamps: true });

module.exports = mongoose.model("Beneficiaire", beneficiaireSchema);
