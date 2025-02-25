const multer = require('multer');
const pdfParse = require('pdf-parse');
const fs = require('fs');
const path = require('path');
require('dotenv').config();
const { generateRandomString } = require('./RandomStringKey');
const crypto = require('./Hashing');

const FOLDERSTOCKAGE = process.env.INTERNAL_STOCKAGE_FOLDER || 'uploads';
let textFiles = [];
let pdfFiles = [];

// Configuration de multer pour le stockage des fichiers
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, FOLDERSTOCKAGE);
    },
    filename: function (req, file, cb) {
        let name = generateRandomString(16) + '.pdf';
        cb(null, name);
        pdfFiles.push(name);
    }
});

const upload = multer({ storage: storage });

// Fonction pour traiter un fichier PDF et extraire son texte
const fileUpload = async (pdfPath) => {
    let encryptedName = crypto.crypt(path.parse(pdfPath).name);
    const pdfName = encryptedName;
    const OUTPUT_EXTENSION = '.txt';

    try {
        const dataBuffer = fs.readFileSync(pdfPath);
        const data = await pdfParse(dataBuffer);

        await fs.promises.writeFile(
            path.join(__dirname, FOLDERSTOCKAGE, pdfName + OUTPUT_EXTENSION),
            data.text
        );

        console.log('Fichier texte créé avec succès');
        textFiles.push(encryptedName);
    } catch (error) {
        console.error('Erreur lors du traitement du PDF:', error);
        throw new Error('Erreur lors de la conversion du PDF en texte');
    }

    return encryptedName;
};

module.exports = {
    fileUpload, 
    upload, 
    textFiles, 
    pdfFiles
};
