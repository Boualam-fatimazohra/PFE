const mongoose = require('mongoose');
const  StagiaireSchema= new mongoose.Schema({
    idCoordinateur: { type: mongoose.Schema.Types.ObjectId, ref: "Coordinateur", required: true },
    nom:{type:String,required:true},
    prenom :{type:String,required:false}
      }, { timestamps: true });
module.exports = mongoose.model("Stagiaire", StagiaireSchema);
