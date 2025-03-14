const mongoose = require('mongoose');

const beneficiaireFileUploadSchema = new mongoose.Schema({
  cloudinaryId: { 
    type: String, 
    required: true 
  },
  cloudinaryUrl: { 
    type: String, 
    required: true 
  },
  cloudinaryFolder: { 
    type: String, 
    required: true 
  },
  originalFilename: { 
    type: String, 
    required: true 
  },
  fileSize: { 
    type: Number, 
    required: true 
  },
  fileType: { 
    type: String, 
    required: true 
  },
  formation: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Formation', 
    required: true 
  },
  uploadedBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Utilisateur', 
    required: true 
  },
  description: { 
    type: String 
  },
  tags: [{ 
    type: String 
  }]
}, { timestamps: true });

module.exports = mongoose.model('BeneficiaireFileUpload', beneficiaireFileUploadSchema);