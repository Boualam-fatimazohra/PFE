const mongoose = require('mongoose');
const  RapportSchema= new mongoose.Schema({
    idCoordinateur: { type: mongoose.Schema.Types.ObjectId, ref: "Coordinateur", required: true },
   type :{type:String,required:true,enum :["Semestriel","Trimestriel","Annuel"]},
      }, { timestamps: true });
module.exports =  mongoose.model("Rapport", RapportSchema);
  