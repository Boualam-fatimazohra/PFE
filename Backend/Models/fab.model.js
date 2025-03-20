const mongoose = require('mongoose');

const fabSchema = new mongoose.Schema({
    entity: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Entity", 
        required: true 
    },
}, { timestamps: true });

// Create index for faster lookups
fabSchema.index({ entity: 1 });

const Fab = mongoose.model("Fab", fabSchema);

module.exports = Fab;