const mongoose = require('mongoose');

const certificationSchema = new mongoose.Schema({
    formation: { 
        type: mongoose.Schema.Types.ObjectId,
         ref: "Formation",
          required: true },
    beneficiaires:
     [{ type: mongoose.Schema.Types.ObjectId,
         ref: "Beneficiaire" }]
  }, { timestamps: true });
  export const Certification = mongoose.model("Certification", certificationSchema);
  