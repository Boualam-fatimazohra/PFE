
const mongoose = require('mongoose');

const beneficiareFormationSchema= new mongoose.Schema({
    confirmationAppel: { type:Boolean, default:false},
    confirmationEmail:{type:Boolean,default:false},
    horodateur:{type:Date,required:false},
    formation: { type:mongoose.Schema.Types.ObjectId, ref:"Formation",required: true },
    beneficiaires:{ type: mongoose.Schema.Types.ObjectId,ref:"Beneficiaire",required:true},
    evaluation:{ type: mongoose.Schema.Types.ObjectId,ref:"Evaluation",required:false},
  }, { timestamps: true });

module.exports = mongoose.model("BeneficiareFormation", beneficiareFormationSchema);
