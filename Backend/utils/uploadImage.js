const multer = require("multer");

const storage = multer.memoryStorage(); // Stocke les fichiers en mémoire
const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    const allowedMimes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Type de fichier non autorisé. Seules les images (JPEG, PNG, GIF, WEBP) sont acceptées.'));
    }
  }
});

module.exports = upload;
