// beneficiaireFileUpload.controller.js
const BeneficiaireFileUpload = require('../Models/BeneficiaireFileUpload');
const Formation = require('../Models/formation.model');
const Formateur = require('../Models/formateur.model');
const { uploadExcel } = require('../Config/cloudinaryConfig');

// Upload Excel file
const uploadBeneficiaireExcel = async (req, res) => {
    try {
      // First use regular multer to handle the upload
      const regularmulter = multer({ 
        storage: multer.memoryStorage(),
        fileFilter: (req, file, cb) => {
          const extension = file.originalname.split('.').pop().toLowerCase();
          if (['xlsx', 'xls', 'csv'].includes(extension)) {
            cb(null, true);
          } else {
            cb(new Error(`Invalid file extension: .${extension}`), false);
          }
        }
      });
  
      // Handle the file upload manually
      regularmulter.single('file')(req, res, async (err) => {
        if (err) {
          return res.status(400).json({ message: err.message });
        }
        
        if (!req.file) {
          return res.status(400).json({ message: 'No file uploaded' });
        }
        
        const formationId = req.body.formationId;
        
        try {
          // Upload to Cloudinary manually
          const result = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
              {
                folder: `formations/excel/${formationId}`,
                resource_type: 'raw',
                public_id: `${Date.now()}_${req.file.originalname}`
              },
              (error, result) => {
                if (error) reject(error);
                else resolve(result);
              }
            );
            
            // Convert buffer to stream and pipe
            const bufferStream = new stream.PassThrough();
            bufferStream.end(req.file.buffer);
            bufferStream.pipe(uploadStream);
          });
          
          // Create file record
          const fileUpload = new BeneficiaireFileUpload({
            cloudinaryId: result.public_id,
            cloudinaryUrl: result.secure_url,
            // other fields...
          });
          
          await fileUpload.save();
          
          res.status(201).json({
            message: "File uploaded successfully",
            fileUpload
          });
        } catch (error) {
          console.error('Cloudinary upload error:', error);
          res.status(500).json({ message: 'Error uploading to Cloudinary', error: error.message });
        }
      });
    } catch (error) {
      console.error('Error in upload handler:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  };

// Get all files for a formation
const getFormationFiles = async (req, res) => {
  try {
    const { formationId } = req.params;
    
    const files = await BeneficiaireFileUpload.find({ formation: formationId })
      .sort({ createdAt: -1 })
      .populate('uploadedBy', 'nom prenom');
    
    res.status(200).json(files);
  } catch (error) {
    console.error("Error fetching files:", error);
    res.status(500).json({ message: "Error fetching files", error: error.message });
  }
};

// Get file details
const getFileDetails = async (req, res) => {
  try {
    const { fileId } = req.params;
    
    const file = await BeneficiaireFileUpload.findById(fileId)
      .populate('formation')
      .populate('uploadedBy', 'nom prenom');
    
    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }
    
    res.status(200).json(file);
  } catch (error) {
    console.error("Error fetching file details:", error);
    res.status(500).json({ message: "Error fetching file details", error: error.message });
  }
};

module.exports = {
  uploadBeneficiaireExcel,
  getFormationFiles,
  getFileDetails
};