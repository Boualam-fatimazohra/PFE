const express = require('express');
const router = express.Router();
const { upload, processCSVFile } = require('../../services/upload/uploadService');

// Route for uploading CSV files
router.post('/csv', upload.single('csvFile'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, error: 'Aucun fichier envoyé' });
        }
        
        const result = await processCSVFile(req.file);
        res.json(result);
    } catch (error) {
        console.error('Error processing uploaded file:', error);
        res.status(500).json({ success: false, error: error.message || 'Erreur lors du traitement du fichier' });
    }
});

module.exports = router;