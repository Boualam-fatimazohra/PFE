// beneficiaireFileUpload.model.js
const mongoose = require('mongoose');

const BeneficiaireFileUploadSchema = new mongoose.Schema({
  // Cloudinary information
  cloudinaryId: { type: String, required: true },
  cloudinaryUrl: { type: String, required: true },
  cloudinaryFolder: { type: String, required: true },
  
  // File information
  originalFilename: { type: String, required: true },
  fileSize: { type: Number },
  fileType: { type: String },
  
  // Relations
  formation: { type: mongoose.Schema.Types.ObjectId, ref: "Formation", required: true },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Utilisateur", required: true },
  
  // Processing information
  uploadDate: { type: Date, default: Date.now },
  isProcessed: { type: Boolean, default: false },
  beneficiairesCount: { type: Number, default: 0 },
  newBeneficiairesCount: { type: Number, default: 0 },
  existingBeneficiairesCount: { type: Number, default: 0 },
  
  // Additional metadata
  description: { type: String },
  tags: [{ type: String }]
}, { timestamps: true });

module.exports = mongoose.model("BeneficiaireFileUpload", BeneficiaireFileUploadSchema);