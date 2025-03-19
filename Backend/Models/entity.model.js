const mongoose = require("mongoose");


const entitySchema = new mongoose.Schema({
    ville: { type: String, required: true },
    type: { type: String, enum: ["OFab", "EDC", "Fab"], required: true }
}, { timestamps: true });

const Entity = mongoose.model("Entity", entitySchema);
module.exports = {Entity};