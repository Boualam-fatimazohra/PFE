const express = require('express');
const multer = require('multer');
const pdfParse = require('pdf-parse');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const { generateRandomString } = require('./RandomStringKey');
const crypto = require('./Hashing');
const axios = require('axios');

const app = express();
app.use(express.json({ limit: '50mb' })); // Augmenter la limite pour les requêtes JSON

// Ajout de la configuration CORS correcte
app.use(cors({
    origin: ['http://localhost:8080', 'http://localhost:3000'], // Ajout du port 3000 souvent utilisé par React
    credentials: true,
    methods: 'GET,POST,PUT,DELETE',
    allowedHeaders: 'Content-Type,Authorization'
}));

// Création du dossier de stockage s'il n'existe pas
const FOLDERSTOCKAGE = process.env.INTERNAL_STOCKAGE_FOLDER || 'uploads';
if (!fs.existsSync(FOLDERSTOCKAGE)) {
    fs.mkdirSync(FOLDERSTOCKAGE, { recursive: true });
}

// Configuration de multer pour le stockage des fichiers
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, FOLDERSTOCKAGE);
    },
    filename: function (req, file, cb) {
        let name = generateRandomString(16) + path.extname(file.originalname);
        cb(null, name);
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
        return { name: pdfName, data: data.text }; // Retourne directement les données
    } catch (error) {
        console.error('Erreur lors du traitement du PDF:', error);
        throw new Error('Erreur lors de la conversion du PDF en texte');
    }
};

// Route pour le message de bienvenue
app.get('/chat', (req, res) => {
    res.status(200).json({ message: "Bonjour ! Je suis votre assistant virtuel. Comment puis-je vous aider aujourd'hui ? Vous pouvez télécharger des fichiers pour que je puisse les analyser." });
});

// Route POST /chat améliorée pour mieux gérer les fichiers
app.post('/chat', async (req, res) => {
    const { message, fileContext = [] } = req.body;
  
    if (!message) {
      return res.status(400).json({ error: "Message manquant" });
    }
  
    try {
      let contextualizedMessage = message;
      let systemPrompt = "Vous êtes un assistant virtuel spécialisé dans l'analyse de données. ";
  
      if (fileContext && fileContext.length > 0) {
        // Vérifier si fileContext contient des données valides
        const validFiles = fileContext.filter(file => 
          file && file.name && file.data && typeof file.data === 'string' && file.data.trim().length > 0
        );
        
        if (validFiles.length > 0) {
          systemPrompt += "Analysez attentivement les fichiers fournis ci-dessous et répondez à la question de l'utilisateur de manière précise et détaillée.";
          
          // Message pour l'utilisateur
          contextualizedMessage = "";
          
          // Ajouter chaque fichier au contexte
          validFiles.forEach((file, index) => {
            contextualizedMessage += `### DÉBUT DU FICHIER ${index + 1}: ${file.name} ###\n${file.data}\n### FIN DU FICHIER ${index + 1}: ${file.name} ###\n\n`;
          });
          
          // Ajouter la question
          contextualizedMessage += `Question: ${message}`;
          
          // Log pour débogage
          console.log(`Envoi à Deepseek - ${validFiles.length} fichiers inclus`);
        } else {
          console.warn("fileContext reçu mais aucun fichier valide trouvé");
        }
      } else {
        systemPrompt += "Répondez aux questions de l'utilisateur de manière utile et précise.";
      }
      
      // Log pour débogage
      console.log(`Longueur totale du message : ${contextualizedMessage.length} caractères`);
  
      const response = await axios.post(
        'https://api.deepseek.com/v1/chat/completions',
        { 
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: contextualizedMessage }
          ],
          model: 'deepseek-chat',
          temperature: 0.3,
          max_tokens: 2000 // Spécifier la taille maximale de la réponse
        },
        {
          headers: {
            'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY || 'VOTRE_CLE_API_ICI'}`,
            'Content-Type': 'application/json'
          }
        }
      );
  
      // Vérifier que nous avons bien une réponse
      if (response.data && response.data.choices && response.data.choices[0]) {
        return res.json({ response: response.data.choices[0].message.content });
      } else {
        throw new Error("Format de réponse API inattendu");
      }
    } catch (error) {
      console.error("Erreur dans le chatbot :", error);
      
      let errorMessage = "Erreur du serveur lors du traitement de votre demande.";
      
      if (error.response) {
        console.error("Code d'erreur API:", error.response.status);
        console.error("Données d'erreur:", error.response.data);
        errorMessage = `Erreur de l'API (${error.response.status}): ${
          error.response.data?.error?.message || 
          (typeof error.response.data === 'string' ? error.response.data : 'Erreur inconnue')
        }`;
      } else if (error.request) {
        errorMessage = "Impossible de contacter l'API Deepseek. Vérifiez votre connexion internet et vos clés API.";
      }
      
      res.status(500).json({ error: errorMessage });
    }
});

// Route d'upload de fichier améliorée
app.post("/upload-csv", upload.single("csvFile"), async (req, res) => {
    if (!req.file) return res.status(400).json({ success: false, error: "Aucun fichier envoyé" });

    const filePath = req.file.path;
    const fileExt = path.extname(req.file.originalname).toLowerCase();
    
    console.log(`Fichier reçu: ${req.file.originalname} (${fileExt}), taille: ${req.file.size} octets`);
    
    try {
        let fileData = "";
        
        // Traitement spécifique selon le type de fichier
        if (fileExt === '.pdf') {
            // Utiliser la fonction existante pour les PDF
            const result = await fileUpload(filePath);
            fileData = result.data;
        } else {
            // Lecture directe pour les autres types de fichiers
            fileData = await fs.promises.readFile(filePath, "utf8");
        }
        
        // Limiter la taille des données envoyées au client
        // Deepseek peut gérer environ 128K tokens, soit environ 100K caractères
        const maxChars = 100000;
        const truncatedData = fileData.length > maxChars 
            ? fileData.substring(0, maxChars) + "\n[... Contenu tronqué pour l'affichage - les données complètes seront utilisées pour l'analyse ...]"
            : fileData;
        
        console.log(`Fichier traité avec succès: ${req.file.originalname}, ${fileData.length} caractères`);
        
        res.json({ 
            success: true, 
            data: truncatedData,
            name: req.file.originalname,
            fullLength: fileData.length
        });
    } catch (error) {
        console.error(`Erreur lors du traitement du fichier ${req.file.originalname}:`, error);
        res.status(500).json({ 
            success: false, 
            error: `Erreur lors du traitement du fichier: ${error.message}`
        });
    }
});

// Démarrage du serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Serveur lancé sur le port ${PORT}`));

module.exports = { fileUpload, upload };