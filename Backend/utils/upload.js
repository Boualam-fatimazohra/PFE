const multer = require("multer");
// Function to process and insert data from Excel
// Configure multer to store files in memory
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

module.exports = upload;