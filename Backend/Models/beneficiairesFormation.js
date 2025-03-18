
const mongoose = require('mongoose');

const beneficiareFormationSchema= new mongoose.Schema({
    confirmationAppel: { type:Boolean, default:false},
    confirmationEmail:{type:Boolean,default:false},
    horodateur:{type:Date,required:false},
    formation: { type:mongoose.Schema.Types.ObjectId, ref:"Formation",required: true },
    beneficiaire:{ type: mongoose.Schema.Types.ObjectId,ref:"Beneficiaire",required:true},
    evaluation:{ type: mongoose.Schema.Types.ObjectId,ref:"Evaluation",required:false},
    // token pour identifier le beneficiaire est ce qu'il a envoyer l'evaluation ou pas 
    token:{type:String,required:false,default:"null"},
    isSubmited: { type: Boolean, default:false } // pour vérifier est ce que l'evaluation est déja envoyer ou pas
  }, { timestamps: true });

module.exports = mongoose.model("BeneficiareFormation", beneficiareFormationSchema);
