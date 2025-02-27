// Evaluation form model
const mongoose = require('mongoose');

const evaluationSchema = new mongoose.Schema({
  formationTitle: {
    type: String,
    require:false
  },
  formationDate: {
    type: String,
    default: "12, 13 & 14 Février 2025"
  },
  contentEvaluation: {
    qualiteContenuFormation: { type: Number, min: 1, max: 5 },
    utiliteCompetencesAcquises: { type: Number, min: 1, max: 5 },
    alignementBesoinsProf: { type: Number, min: 1, max: 5 },
    structureFormation: { type: Number, min: 1, max: 5 },
    niveauDifficulte: { type: Number, min: 1, max: 5 }
  },
  pedagogy: {
    qualitePedagogique: { type: Number, min: 1, max: 5 },
    expertiseFormateur: { type: Number, min: 1, max: 5 },
    qualiteSupportFormation: { type: Number, min: 1, max: 5 },
    qualiteExercices: { type: Number, min: 1, max: 5 },
    adaptationNiveauParticipants: { type: Number, min: 1, max: 5 }
  },
  materialConditions: {
    confortSalle: { type: Number, min: 1, max: 5 },
    accessibiliteLieu: { type: Number, min: 1, max: 5 },
    horaires: { type: Number, min: 1, max: 5 },
    materielPedagogique: { type: Number, min: 1, max: 5 }
  },
  generalOrganization: {
    communicationOrganisationnelle: { type: Number, min: 1, max: 5 }
  },
  submittedAt: {
    type: Date,
    default: Date.now
  },
  recommandation:{type:String,enum :["Oui","Non"] ,required:true},
  commentaire:{type:String,required:false},
  formation:{type:mongoose.Schema.Types.ObjectId,ref:"Formation",required:true},
  
});

const Evaluation = mongoose.model('Evaluation', evaluationSchema);

module.exports = Evaluation;