const mongoose = require('mongoose');
const  PresenceSchema= new mongoose.Schema({
    beneficiareFormation: { type: mongoose.Schema.Types.ObjectId, ref: "beneficiairesFormation", required: true },
    jour:{type:Date,required:true},
    isPresent :{type:Boolean,required:false}
      }, { timestamps: true });
  const Presence = mongoose.model("Presence", PresenceSchema);
  module.exports = Presence;