const seanceSchema = new mongoose.Schema({
    formation: { type: mongoose.Schema.Types.ObjectId, ref: "Formation", required: true },
    date: { type: Date, required: true },
    beneficiaires: [{
      beneficiaire: { type: mongoose.Schema.Types.ObjectId, ref: "Bénéficiaire", required: true },
      present: { type: Boolean, default: false }, // Indique si le bénéficiaire était présent
    
    }]
  }, { timestamps: true });
  
  const Seance = mongoose.model("Seance", seanceSchema);
  