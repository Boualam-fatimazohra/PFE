const seanceSchema = new mongoose.Schema({
    formation: { type: mongoose.Schema.Types.ObjectId, ref: "Formation", required: true },
  }, { timestamps: true });
  
  const Seance = mongoose.model("Seance", seanceSchema);
  