const mongoose = require('mongoose');

const oFabSchema = new mongoose.Schema({
    entity: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Entity", 
        required: true 
    },
}, { timestamps: true });

// Create index for faster lookups
oFabSchema.index({ entity: 1 });

const OFab = mongoose.model("OFab", oFabSchema);

module.exports = OFab;