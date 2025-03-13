const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads directory exists
const initializeUploadsDirectory = () => {
    const uploadsDir = path.join(__dirname, '../../uploads');
    if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
    }
    return uploadsDir;
};

// Configure multer storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});

// Create multer upload instance
const upload = multer({ storage: storage });

// Process uploaded CSV file
const processCSVFile = async (file) => {
    try {
        const data = await fs.promises.readFile(file.path, 'utf8');
        // Return the first portion of the file and the file name
        return {
            success: true,
            data: data.substring(0, 1000),
            name: file.originalname
        };
    } catch (err) {
        throw new Error(`Error reading file: ${err.message}`);
    }
};

module.exports = {
    initializeUploadsDirectory,
    upload,
    processCSVFile
};