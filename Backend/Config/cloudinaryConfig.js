const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
const streamifier = require('streamifier');
require('dotenv').config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Set up Cloudinary storage for images
const imageStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'formations',
    allowed_formats: ['jpg', 'jpeg', 'png'],
    transformation: [{ width: 500, height: 500, crop: 'limit' }]
  }
});

// Set up Cloudinary storage for Excel files
const excelStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: (req, file) => {
      const formationId = req.body.formationId || req.query.formationId || 'unknown';
      return `formations/excel/${formationId}`;
    },
    resource_type: 'raw', // This is crucial for Excel files
    allowed_formats: ['xlsx', 'xls', 'csv'], // Make sure these match your file types
  }
});

// Create multer upload middleware for images
const uploadImage = multer({ storage: imageStorage });

// Create multer upload middleware for Excel files
const uploadExcel = multer({
  storage: excelStorage,
  fileFilter: (req, file, cb) => {
    // Get the file extension
    const extension = file.originalname.split('.').pop().toLowerCase();
    
    // Check if the extension is one of the Excel types
    if (['xlsx', 'xls', 'csv'].includes(extension)) {
      cb(null, true);
    } else {
      console.log('Rejected file extension:', extension);
      cb(new Error(`Invalid file extension: .${extension}. Please upload only .xlsx, .xls, or .csv files.`), false);
    }
  }
});

// Helper function to upload buffer to cloudinary
const uploadToCloudinary = (buffer, options = {}) => {
  return new Promise((resolve, reject) => {
    const stream = streamifier.createReadStream(buffer);
    const uploadStream = cloudinary.uploader.upload_stream(
      options,
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

// Helper function to delete from cloudinary
const deleteFromCloudinary = async (publicId) => {
  return await cloudinary.uploader.destroy(publicId);
};

// Helper function to create a folder for uploads
const createFolder = async (folderPath) => {
  return await cloudinary.api.create_folder(folderPath);
};

// Helper function to get resources in a folder
const getFolderResources = async (folderPath) => {
  return await cloudinary.api.resources({
    type: 'upload',
    prefix: folderPath
  });
};

module.exports = {
  cloudinary,
  uploadImage,
  uploadExcel,
  uploadToCloudinary,
  deleteFromCloudinary,
  createFolder,
  getFolderResources
};