const mongoose = require('mongoose');

const edcSchema = new mongoose.Schema({
    entity: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Entity", 
        required: true 
    },
}, { timestamps: true });

// Create index for faster lookups
edcSchema.index({ entity: 1 });

const EDC = mongoose.model("EDC", edcSchema);

module.exports = EDC;