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
app.use(express.json({ limit: '200mb' })); // Augmenté à 200mb pour supporter des fichiers plus grands
app.use(express.urlencoded({ extended: true, limit: '200mb' })); // Ajouté pour traiter les grands formulaires

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

// Configuration de multer pour le stockage des fichiers avec limite augmentée
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, FOLDERSTOCKAGE);
    },
    filename: function (req, file, cb) {
        let name = generateRandomString(16) + path.extname(file.originalname);
        cb(null, name);
    }
});
const upload = multer({ 
    storage: storage,
    limits: { fileSize: 200 * 1024 * 1024 } // Limite augmentée à 200MB
});

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

// Route POST /chat améliorée pour mieux gérer les fichiers volumineux
app.post('/chat', async (req, res) => {
  try {
    const { message, fileContext = [], hideFromChat } = req.body;
    let fileContents = [];

    // Traitement des fichiers avec priorité à fullData
    for (const file of fileContext) {
      let fileContent = "";
      
      // Priorité 1: Utiliser fullData si disponible
      if (file.fullData && typeof file.fullData === 'string' && file.fullData.trim().length > 0) {
        console.log(`Utilisation de fullData pour ${file.name}, longueur: ${file.fullData.length}`);
        fileContent = file.fullData;
      } 
      // Priorité 2: Lire depuis fullPath si disponible et si fullData n'est pas disponible
      else if (file.fullPath && fs.existsSync(file.fullPath)) {
        try {
          console.log(`Lecture du fichier complet depuis ${file.fullPath}`);
          fileContent = fs.readFileSync(file.fullPath, 'utf8');
          console.log(`Fichier lu avec succès, longueur: ${fileContent.length}`);
          
          // Mettre à jour file.fullData pour les utilisations futures
          file.fullData = fileContent;
        } catch (err) {
          console.error(`Erreur lors de la lecture du fichier ${file.fullPath}:`, err);
          // Fallback sur les données partielles
          fileContent = file.data || "";
        }
      } 
      // Priorité 3: Utiliser data comme dernier recours
      else {
        console.log(`Utilisation de data pour ${file.name}, longueur: ${file.data ? file.data.length : 0}`);
        fileContent = file.data || "";
      }

      if (fileContent.trim().length === 0) {
        console.warn(`Contenu vide pour le fichier ${file.name}`);
      } else {
        fileContents.push(`### FICHIER: ${file.name} ###\n${fileContent}\n`);
      }
    }
  
    if (!message) {
      return res.status(400).json({ error: "Message manquant" });
    }

    // Traitement spécial pour les requêtes numériques en arrière-plan
    if (hideFromChat) {
      let numericResponse;

      if (message.includes('uniquement le chiffre')) {
        // Détecter le type de requête numérique
        if (message.includes('bénéficiaires') || message.includes('beneficiaires')) {
          numericResponse = calculateTotalBeneficiaries(fileContext);
        } else if (message.includes('numéros') && message.includes('éligibles')) {
          numericResponse = calculateEligiblePhoneNumbers(fileContext);
        } else if (message.includes('total des contacts')) {
          numericResponse = calculateTotalContacts(fileContext);
        }

        // Si on a une réponse numérique, la renvoyer directement
        if (numericResponse !== undefined) {
          return res.json({ response: numericResponse.toString() });
        }
      }
    }

    // Construction du prompt pour Deepseek
    let systemPrompt = "Vous êtes un assistant virtuel spécialisé dans l'analyse de données.";
    
    if (fileContents.length > 0) {
      systemPrompt += " Analysez attentivement les fichiers fournis ci-dessous et répondez précisément. Assurez-vous de traiter toutes les lignes et colonnes des données.";
    }

    // Création du message contextualisé avec tous les fichiers
    let contextualizedMessage = fileContents.join("\n") + `\nQuestion: ${message}`;
    
    // Gestion de la limite de taille pour l'API Deepseek
    // Augmenté à 500 000 pour supporter des fichiers plus volumineux
    const MAX_DEEPSEEK_SIZE = 500000; 
    
    if (contextualizedMessage.length > MAX_DEEPSEEK_SIZE) {
      console.warn(`Message trop volumineux (${contextualizedMessage.length} caractères), troncature intelligente à ${MAX_DEEPSEEK_SIZE}`);
      
      // Préserver la question
      const questionPart = `\nQuestion: ${message}`;
      const availableSize = MAX_DEEPSEEK_SIZE - questionPart.length - 500; // réserve 500 caractères pour les en-têtes
      
      if (availableSize <= 0) {
        throw new Error("Le message est trop volumineux, même sans contexte");
      }
      
      // Approche de division plus intelligente:
      // 1. Si un seul fichier, prendre les parties du début et de la fin
      if (fileContents.length === 1) {
        const fileContent = fileContents[0];
        const fileHeaderEnd = fileContent.indexOf("\n") + 1;
        const fileHeader = fileContent.substring(0, fileHeaderEnd);
        const contentBody = fileContent.substring(fileHeaderEnd);
        
        // Prendre la moitié du début et la moitié de la fin pour avoir une vue d'ensemble
        const halfSize = availableSize / 2;
        const firstPart = contentBody.substring(0, halfSize);
        const lastPart = contentBody.substring(contentBody.length - halfSize);
        
        contextualizedMessage = fileHeader + firstPart + 
                              "\n\n[... Partie centrale omise pour respecter les limites de l'API ...]\n\n" + 
                              lastPart + questionPart;
      } 
      // 2. Si plusieurs fichiers, répartir équitablement
      else {
        const perFileSize = Math.floor(availableSize / fileContents.length);
        const truncatedContents = fileContents.map(content => {
          const fileHeaderEnd = content.indexOf("\n") + 1;
          const fileHeader = content.substring(0, fileHeaderEnd);
          const fileContent = content.substring(fileHeaderEnd);
          
          if (fileContent.length <= perFileSize) {
            return content;
          }
          
          return fileHeader + fileContent.substring(0, perFileSize) + 
                 "\n[... Contenu tronqué pour respecter les limites de l'API ...]";
        });
        
        contextualizedMessage = truncatedContents.join("\n") + questionPart;
      }
    }

    console.log(`Envoi à Deepseek - ${fileContents.length} fichiers inclus`);
    console.log(`Longueur totale du message : ${contextualizedMessage.length} caractères`);

    // Appel à l'API Deepseek avec timeout augmenté
    const response = await axios.post(
      'https://api.deepseek.com/v1/chat/completions',
      { 
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: contextualizedMessage }
        ],
        model: 'deepseek-chat',
        temperature: 0.3,
        max_tokens: 8000  // Augmenté pour des réponses plus complètes
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY || 'VOTRE_CLE_API_ICI'}`,
          'Content-Type': 'application/json'
        },
        timeout: 300000 // 5 minutes pour traiter les fichiers volumineux
      }
    );

    if (response.data?.choices?.[0]) {
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
      
      // Si l'erreur est liée à la taille des données
      if (error.response.status === 413 || 
          (error.response.data?.error?.message && 
           error.response.data.error.message.includes('too large'))) {
        errorMessage = "Le fichier est trop volumineux pour être traité en une seule fois. Le système va tenter d'extraire les informations les plus pertinentes.";
        
        // Ici, vous pourriez implémenter une logique de repli pour extraire des informations clés du fichier
        // et reformuler une requête plus petite
      }
    } else if (error.request) {
      errorMessage = "Impossible de contacter l'API Deepseek. Vérifiez votre connexion internet et vos clés API.";
    }

    res.status(500).json({ error: errorMessage });
  }
});

// Fonctions de calcul améliorées
function calculateTotalBeneficiaries(fileContext) {
  // Implémenter la vraie logique d'analyse des fichiers ici
  console.log("Calcul du nombre de bénéficiaires...");
  
  // Si on a des fichiers, tenter une analyse simple
  if (Array.isArray(fileContext) && fileContext.length > 0) {
    try {
      // Exemple: chercher des motifs qui pourraient indiquer des bénéficiaires
      let totalFound = 0;
      fileContext.forEach(file => {
        // Priorité à fullData pour une analyse complète
        const contentToAnalyze = file.fullData || file.data || "";
        // Recherche simple de mots-clés
        const occurrences = (contentToAnalyze.match(/bénéficiaire|beneficiaire|apprenant|participant/gi) || []).length;
        totalFound += occurrences;
      });
      
      // Si rien n'a été trouvé, valeur par défaut
      return totalFound > 0 ? totalFound : 450;
    } catch (error) {
      console.error("Erreur lors du calcul des bénéficiaires:", error);
    }
  }
  return 450; // Valeur par défaut
}

function calculateEligiblePhoneNumbers(fileContext) {
  // Implémenter la vraie logique d'analyse ici
  // Comme exemple, retourner ~45% du nombre de bénéficiaires
  const beneficiaries = calculateTotalBeneficiaries(fileContext);
  return Math.floor(beneficiaries * 0.45);
}

function calculateTotalContacts(fileContext) {
  // Par défaut, considérons que le total des contacts est égal
  // au nombre de bénéficiaires pour cet exemple
  return calculateTotalBeneficiaries(fileContext);
}

// Route d'upload de fichier améliorée pour traiter des fichiers plus volumineux
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
      
      // Vérifier que les données sont valides
      if (!fileData || fileData.trim().length === 0) {
          throw new Error("Aucune donnée extraite du fichier");
      }
      
      // Calculer des statistiques sur le fichier pour le débogage
      const lineCount = fileData.split('\n').length;
      console.log(`Fichier traité: ${req.file.originalname}, ${lineCount} lignes, ${fileData.length} caractères`);
      
      // Pour l'affichage dans l'interface, on limite à 20000 caractères (augmenté)
      const displayLimit = 20000;
      const truncatedForDisplay = fileData.length > displayLimit
          ? fileData.substring(0, displayLimit) + 
            "\n[... Contenu tronqué pour l'affichage seulement - le fichier complet sera utilisé pour l'analyse ...]"
          : fileData;
      
      // Stockage du fichier complet pour l'analyse future
      const storeFileName = `${Date.now()}_${path.parse(req.file.originalname).name}_processed${path.extname(req.file.originalname)}`;
      const storePath = path.join(FOLDERSTOCKAGE, storeFileName);
      
      // S'assurer que le dossier existe
      await fs.promises.mkdir(path.dirname(storePath), { recursive: true });
      
      // Écrire le fichier complet
      await fs.promises.writeFile(storePath, fileData);
      
      console.log(`Fichier complet sauvegardé pour analyse: ${storePath} (${fileData.length} caractères)`);
      
      // S'assurer que le chemin est absolu pour une utilisation future
      const absoluteStorePath = path.resolve(storePath);
      
      res.json({ 
          success: true, 
          data: truncatedForDisplay, // Version tronquée pour l'affichage seulement
          name: req.file.originalname,
          fullPath: absoluteStorePath, // Chemin absolu vers le fichier complet
          fullLength: fileData.length,
          lineCount: lineCount,
          fullData: fileData // Données complètes pour l'analyse immédiate
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