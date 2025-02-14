// utils/upload.js
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Ensure the 'uploads' directory exists
const uploadDir = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log("Uploads directory created.");
}

// Set up storage engine for multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // Save the file in the 'uploads' folder
  },
  filename: (req, file, cb) => {
    // Give the file a unique name using current timestamp
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

// Set up multer with the storage configuration
const upload = multer({ storage: storage });

module.exports = upload;
