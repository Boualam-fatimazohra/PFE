const mongoose = require('mongoose');

const evaluationSchema = new mongoose.Schema({
    tauxSatisfaction: { type: Number, min: 0, max: 100, required: false },
    lienEvaluation: { type: String, required: true },
    questions: { type: String, required: true },
    formation: { type: mongoose.Schema.Types.ObjectId, ref: "Formation", required: true }
  }, { timestamps: true });
  export const Evaluation = mongoose.model("Evaluation", evaluationSchema);
  
