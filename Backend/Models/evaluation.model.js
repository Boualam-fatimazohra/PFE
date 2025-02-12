const  mongoose=require("mongoose");

const evaluationSchema = new mongoose.Schema(
  {
    tauxSatisfaction: { type: Number, min: 0, max: 100, required: false },
    lienEvaluation: { type: String, required: true },
    questions: { type: String, required: true },  // Si c'est un tableau, ajuste ce type
    formation: { type: mongoose.Schema.Types.ObjectId, ref: "Formation", required: true }
  },
  { timestamps: true }
);

// Export du modèle
module.exports = mongoose.model("Evaluation", evaluationSchema);
