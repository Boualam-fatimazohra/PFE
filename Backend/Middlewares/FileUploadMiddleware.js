const multer = require('multer');

// Configure temporary storage in memory
const storage = multer.memoryStorage();

// File filter for Excel and CSV files
const fileFilter = (req, file, cb) => {
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
};

// Create upload middleware
const upload = multer({ 
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB max file size
  }
});

// Error handler for multer errors
const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    // A Multer error occurred when uploading
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        message: 'File is too large. Maximum file size is 10MB.'
      });
    }
    return res.status(400).json({
      message: `Upload error: ${err.message}`
    });
  } else if (err) {
    // An unknown error occurred
    return res.status(400).json({
      message: err.message
    });
  }
  
  // If no error, continue
  next();
};

module.exports = {
  upload,
  handleMulterError
};