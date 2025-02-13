const seanceSchema = new mongoose.Schema({
    formation: { type: mongoose.Schema.Types.ObjectId, ref: "Formation", required: true },
    bénéficiaire: { type: mongoose.Schema.Types.ObjectId, ref: "bénéficiaire", required: true },
    présence :[
      {date: { type: Date, required: true },
      present: { type: Boolean, default: false }}// Indique si le bénéficiaire était présent
    ]
  }, { timestamps: true });
  
  const Seance = mongoose.model("Seance", seanceSchema);
  