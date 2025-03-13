const express = require('express');
const router = express.Router();
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');
const BeneficiaireFileUpload = require('../Models/BeneficiaireFileUpload');
const authenticated = require('../Middlewares/Authmiddleware');
const authorizeRoles = require('../Middlewares/RoleMiddleware');
const mongoose = require('mongoose');
const XLSX = require('xlsx');

// Configure cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure temporary storage
const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  fileFilter: (req, file, cb) => {
    // Accept only excel and csv files
    if (file.mimetype === 'application/vnd.ms-excel' || 
        file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
        file.mimetype === 'text/csv' ||
        file.originalname.endsWith('.xlsx') ||
        file.originalname.endsWith('.xls') ||
        file.originalname.endsWith('.csv')) {
      cb(null, true);
    } else {
      cb(new Error('Only Excel files and CSV files are allowed'), false);
    }
  },
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB max file size
  }
});

router.post('/upload',
  authenticated,
  authorizeRoles('Admin', 'Formateur', 'Manager'),
  upload.single('file'),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }
      
      // Validate formation ID
      const formationId = req.body.formationId;
      if (!formationId || !mongoose.Types.ObjectId.isValid(formationId)) {
        return res.status(400).json({ message: 'Valid formation ID is required' });
      }
      
      console.log('Processing upload for formation:', formationId);

      // First, check file validity by parsing a few rows
      try {
        const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });
        if (!workbook.SheetNames.length) {
          return res.status(400).json({ message: 'The uploaded Excel file has no sheets' });
        }
        
        // Get first sheet and verify it has data
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const sampleData = XLSX.utils.sheet_to_json(worksheet, { range: 0, header: 1 });
        
        if (!sampleData || sampleData.length < 2) { // Assuming at least a header row and one data row
          return res.status(400).json({ message: 'The uploaded file appears to be empty or invalid' });
        }
        
        console.log('File verified, sample row count:', sampleData.length);
      } catch (parseError) {
        console.error('Error parsing Excel file:', parseError);
        return res.status(400).json({ message: 'Cannot parse the uploaded file. Please ensure it is a valid Excel or CSV file', error: parseError.message });
      }

      // Create Cloudinary upload stream
      let streamUpload = (buffer) => {
        return new Promise((resolve, reject) => {
          let stream = streamifier.createReadStream(buffer);
          let uploadStream = cloudinary.uploader.upload_stream(
            {
              folder: `formations/${formationId}`,
              resource_type: 'auto', // Let Cloudinary detect the type
              public_id: `beneficiaires_${Date.now()}`,
              tags: ['excel', 'beneficiaires', formationId]
            },
            (error, result) => {
              if (result) {
                resolve(result);
              } else {
                reject(error);
              }
            }
          );
          stream.pipe(uploadStream);
        });
      };
      
      // Upload the file
      const result = await streamUpload(req.file.buffer);
      console.log('Cloudinary upload successful. Public ID:', result.public_id);
      
      // Create record in database
      const fileUpload = new BeneficiaireFileUpload({
        cloudinaryId: result.public_id,
        cloudinaryUrl: result.secure_url,
        cloudinaryFolder: `formations/${formationId}`,
        originalFilename: req.file.originalname,
        fileSize: req.file.size,
        fileType: req.file.mimetype,
        formation: formationId,
        uploadedBy: req.user.userId,
        description: req.body.description || `Uploaded on ${new Date().toLocaleString()}`,
        tags: ['excel', 'import']
      });
      
      await fileUpload.save();
      
      res.status(201).json({
        message: "File uploaded successfully",
        fileUpload: {
          id: fileUpload._id,
          filename: fileUpload.originalFilename,
          url: fileUpload.cloudinaryUrl,
          uploadDate: fileUpload.uploadDate
        }
      });
    } catch (error) {
      console.error('Error uploading file:', error);
      res.status(500).json({ 
        message: "Error uploading file",
        error: error.message,
        details: error.http_code ? `HTTP ${error.http_code}` : undefined
      });
    }
  }
);


module.exports = router;