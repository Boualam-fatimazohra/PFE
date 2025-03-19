const mongoose = require('mongoose');

const utilisateurEntitySchema = new mongoose.Schema({
    id_utilisateur: { type: mongoose.Schema.Types.ObjectId, ref: 'Utilisateur', required: true },
    id_entity: { type: mongoose.Schema.Types.ObjectId, ref: 'Entity', required: true },
    date: { type: Date, default: Date.now }
}, { timestamps: true });

const UtilisateurEntity = mongoose.model("UtilisateurEntity", utilisateurEntitySchema);
module.exports ={UtilisateurEntity};