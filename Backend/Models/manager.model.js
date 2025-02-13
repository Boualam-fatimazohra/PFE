const mongoose = require('mongoose');

const managerSchema = new mongoose.Schema({
    utilisateur: { type: mongoose.Schema.Types.ObjectId, ref: "Utilisateur", required: true },
      }, { timestamps: true });
  const Manager = mongoose.model("Manager", managerSchema);
  module.exports = Manager;