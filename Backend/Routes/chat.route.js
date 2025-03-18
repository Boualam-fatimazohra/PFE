const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { uploadCSV, getChatWelcome, sendChatMessage } = require("../Controllers/chat.controller.js");

// Configuration du stockage multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadsDir = path.join(__dirname, "../uploads");
        if (!fs.existsSync(uploadsDir)){
            fs.mkdirSync(uploadsDir, { recursive: true });
        }
        cb(null, uploadsDir);
    },
    filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});

const upload = multer({ storage: storage });

// Routes pour le chatbot et l'upload de fichiers
router.post("/upload-csv", upload.single("csvFile"), uploadCSV);
router.get("/chat", getChatWelcome);
router.post("/chat", sendChatMessage);

module.exports = router;