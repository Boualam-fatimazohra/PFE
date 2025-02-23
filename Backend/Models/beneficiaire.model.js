
const mongoose = require('mongoose');

const beneficiaireSchema = new mongoose.Schema({
    nom: { type: String, required: true },
    prenom: { type: String, required:false },
    dateNaissance: { type: Date, required:false},
    email:{type:String,required:true},
    genre :{type:String,required:true},
    telephone:{type:Number,required : false},
    pays:{type:String,required:true},
    //enum :["bac","bac+2","bac+3","bac+5"]
    niveau: { type: String, required:false,enum :["bac","bac+2","bac+3","bac+5"]},
    specialite: {type:String,required:false},
    etablissement:{type:String,required:false},
    //enum:["Sans Emploi","Avec Emploi","Etudiant"]
    profession:{type:String,required:false},
    situationProfessionnel:{type:String,required:false,enum:["Sans Emploi","Avec Emploi","Etudiant"]},
    // est ce que le beneficiaire est blacklister ou pas 
    isBlack: { type: Boolean, default: false },
    // est ce qu'il a dépasser 3 formation ou pas 
    isSaturate: { type: Boolean, default: false },
    nationalite: {type:String,required:false},
    region:{type:String,required:false,enum:["Souss Massa","Draa Tafilalte"],default:"null"}
  }, { timestamps: true });

module.exports = mongoose.model("Beneficiaire", beneficiaireSchema);
