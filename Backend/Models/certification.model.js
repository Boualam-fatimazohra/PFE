const mongoose = require('mongoose');

const certificationSchema = new mongoose.Schema({
    beneficiaires:
    { type: mongoose.Schema.Types.ObjectId,
         ref: "BeneficiareFormation" },
    isDeserve:{type:Boolean,default:false},
  }, { timestamps: true });
  export const Certification = mongoose.model("Certification", certificationSchema);
  