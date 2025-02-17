const mongoose = require('mongoose');

const seanceSchema = new mongoose.Schema({
    formation: { type: mongoose.Schema.Types.ObjectId,ref:"Formation",required: true },
    date :{type:Date,required:true},
    periode:{type:String,required:true,enum:["Matin","Soir"]},
  }, { timestamps: true });
const  Seance = mongoose.model("Seance",seanceSchema);
module.exports = Seance;
