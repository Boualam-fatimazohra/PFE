const mongoose = require('mongoose');

const classeSchema = new mongoose.Schema({
    formation: { type: mongoose.Schema.Types.ObjectId, ref: "Formation" }
  }, { timestamps: true });
  const Classe = mongoose.model("Classe", classeSchema);
  module.exports=Classe;