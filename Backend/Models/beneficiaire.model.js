
const mongoose = require('mongoose');

const beneficiaireSchema = new mongoose.Schema({
    nom: { type: String, required: true },
    prenom: { type: String, required:false },
    dateNaissance: { type: Date, required:false},
    email:{type:String,required:true},
    genre :{type:String,required:true},
    // normalement le telephone doit etre de type number
    telephone:{type:String,required : false},
    pays:{type:String,required:true},
    niveau: { type: String, required:false,enum :["bac","bac+2","bac+3","bac+5"]},
    specialite: {type:String,required:false},
    etablissement:{type:String,required:false},
    profession:{type:String,required:false},
    situationProfessionnel:{type:String,required:false,enum:["Sans Emploi","Employe","Etudiant"]},
    // est ce que le beneficiaire est blacklister ou pas 
    isBlack: { type: Boolean, default: false },
    // est ce qu'il a dépasse 3 formation ou pas 
    isSaturate: { type: Boolean, default: false },
    nationalite: {type:String,required:false},
     region:{type:String,required:false,enum:["Souss Massa","Draa Tafilalte","Oued Ed-Dahab"],default:"Souss Massa"},
    categorieAge:{type:String,required:false,enum:["Moin_15","Entre15_24","Entre25_34","Plus_34"],default:"Entre15_24"},
  }, { timestamps: true });

module.exports = mongoose.model("Beneficiaire", beneficiaireSchema);
