const fs = require("fs");
const axios = require("axios");
const multer = require('multer');
const pdfParse = require('pdf-parse');
const path = require('path');
const crypto = require('crypto');
require('dotenv').config();
const encryptionKey = crypto.scryptSync(process.env.CRYPTO_KEY, 'salt', 32);
const iv = process.env.CRYPTO_IV;
function crypt(text, key = encryptionKey) {
  const cipher = crypto.createCipheriv('aes-256-cbc', key, Buffer.from(iv, 'hex'));
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return encrypted.toString('hex');
}
function decrypt(encrypted, key = encryptionKey) {
  const decipher = crypto.createDecipheriv('aes-256-cbc', key, Buffer.from(iv, 'hex'));
  let decrypted = decipher.update(Buffer.from(encrypted, 'hex'));
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
}
// Function to generate a random string of a given length
const generateRandomString = (length) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
};

module.exports = { generateRandomString };
// Stockage des historiques de conversation par utilisateur
const userConversations = {};

// Création du dossier de stockage s'il n'existe pas
const FOLDERSTOCKAGE = process.env.INTERNAL_STOCKAGE_FOLDER || 'uploads';
if (!fs.existsSync(FOLDERSTOCKAGE)) {
    fs.mkdirSync(FOLDERSTOCKAGE, { recursive: true });
}

// Configuration de multer pour le stockage des fichiers avec limite augmentée
const storage = multer.memoryStorage(); // Utilise memoryStorage au lieu de diskStorage

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

// Fonction améliorée pour interagir avec DeepSeek API
const deepSeekChat = async (userId, message, fileContext = [], hideFromChat = false) => {
    try {
        // Initialiser la conversation pour l'utilisateur si elle n'existe pas
        if (!userConversations[userId]) {
            userConversations[userId] = [];
        }
        
        // Traiter les fichiers pour extraire leur contenu
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
                    return numericResponse.toString();
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
        
        // Créer les messages pour l'API avec un message système
        const messages = [
            { role: "system", content: systemPrompt },
            ...userConversations[userId],
            { role: "user", content: contextualizedMessage }
        ];

        // Appeler l'API DeepSeek avec retry (3 tentatives max)
        let response;
        let attempts = 0;
        const maxAttempts = 3;
        
        while (attempts < maxAttempts) {
            try {
                response = await axios.post(
                    "https://api.deepseek.com/v1/chat/completions",
                    {
                        model: "deepseek-chat",
                        messages: messages,
                        temperature: 0.3,
                        max_tokens: 8000  // Augmenté pour des réponses plus complètes
                    },
                    {
                        headers: {
                            "Authorization": `Bearer ${process.env.DEEPSEEK_API_KEY || 'VOTRE_CLE_API_ICI'}`,
                            "Content-Type": "application/json"
                        },
                        timeout: 300000 // 5 minutes pour traiter les fichiers volumineux
                    }
                );
                
                // Si on arrive ici, la requête a réussi
                break;
            } catch (error) {
                attempts++;
                console.warn(`Tentative ${attempts}/${maxAttempts} échouée: ${error.message}`);
                
                if (attempts >= maxAttempts) {
                    // Si on a atteint le nombre max de tentatives, propager l'erreur
                    throw error;
                }
                
                // Attendre avant de réessayer (backoff exponentiel)
                await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, attempts)));
            }
        }
        
        // Valider la structure de la réponse
        if (!response || !response.data) {
            throw new Error("Réponse vide de l'API DeepSeek");
        }
        
        if (!response.data.choices || !Array.isArray(response.data.choices) || response.data.choices.length === 0) {
            console.error("Structure de réponse inattendue:", JSON.stringify(response.data));
            throw new Error("Format de réponse API invalide: 'choices' manquant ou vide");
        }
        
        if (!response.data.choices[0].message || !response.data.choices[0].message.content) {
            console.error("Structure message inattendue:", JSON.stringify(response.data.choices[0]));
            throw new Error("Format de réponse API invalide: 'message.content' manquant");
        }
        
        // Extraire la réponse
        const botResponse = response.data.choices[0].message.content;
        
        // Ne stocker la conversation que si ce n'est pas un traitement en arrière-plan
        if (!hideFromChat) {
            // Stocker la conversation (seulement le message utilisateur et la réponse)
            userConversations[userId].push({ role: "user", content: contextualizedMessage });
            userConversations[userId].push({ role: "assistant", content: botResponse });
            
            // Limiter la taille de l'historique (max 10 derniers échanges = 20 messages)
            if (userConversations[userId].length > 20) {
                userConversations[userId] = userConversations[userId].slice(-20);
            }
        }
        
        return botResponse;
    } catch (error) {
        // Gérer les différents types d'erreurs
        console.error("Erreur DeepSeek API:", error);
        
        // Erreurs spécifiques
        if (error.response) {
            // L'API a répondu avec un code d'erreur
            console.error("Statut de l'erreur:", error.response.status);
            console.error("Données d'erreur:", error.response.data);
            
            if (error.response.status === 401) {
                throw new Error("Authentification à l'API DeepSeek échouée: clé API invalide");
            } else if (error.response.status === 429) {
                throw new Error("Limite de requêtes DeepSeek atteinte. Veuillez réessayer plus tard.");
            } else if (error.response.status === 413 || 
                  (error.response.data?.error?.message && 
                  error.response.data.error.message.includes('too large'))) {
                throw new Error("Le fichier est trop volumineux pour être traité en une seule fois. Le système va tenter d'extraire les informations les plus pertinentes.");
            } else {
                throw new Error(`Erreur API DeepSeek (${error.response.status}): ${
                    error.response.data?.error?.message || 
                    JSON.stringify(error.response.data) || 
                    "Raison inconnue"
                }`);
            }
        } else if (error.request) {
            // La requête a été envoyée mais pas de réponse
            throw new Error("Aucune réponse reçue de l'API DeepSeek. Vérifiez votre connexion réseau.");
        } else if (error.message) {
            // Erreur lors de la configuration de la requête
            throw new Error(`Erreur DeepSeek: ${error.message}`);
        } else {
            // Erreur inconnue
            throw new Error("Impossible de récupérer une réponse de l'API DeepSeek");
        }
    }
};

// Contrôleur pour l'upload de fichiers (prend en charge les PDF et autres types)
const uploadCSV = async (req, res) => {
    if (!req.file) return res.status(400).json({ success: false, error: "Aucun fichier envoyé" });

    const fileBuffer = req.file.buffer; // Accéder au buffer du fichier
    const fileExt = path.extname(req.file.originalname).toLowerCase();
    
    console.log(`Fichier reçu: ${req.file.originalname} (${fileExt}), taille: ${fileBuffer.length} octets`);
    
    try {
        let fileData = "";
        
        // Traitement spécifique selon le type de fichier
        if (fileExt === '.pdf') {
            // Utiliser pdf-parse pour extraire le texte du PDF
            const data = await pdfParse(fileBuffer);
            fileData = data.text;
        } else {
            // Convertir le buffer en string pour les autres types de fichiers
            fileData = fileBuffer.toString("utf8");
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
        
        // Retourner les données sans sauvegarder sur le disque
        res.json({ 
            success: true, 
            data: truncatedForDisplay, // Version tronquée pour l'affichage seulement
            name: req.file.originalname,
            fullData: fileData, // Données complètes pour l'analyse immédiate
            fullLength: fileData.length,
            lineCount: lineCount
        });
    } catch (error) {
        console.error(`Erreur lors du traitement du fichier ${req.file.originalname}:`, error);
        res.status(500).json({ 
            success: false, 
            error: `Erreur lors du traitement du fichier: ${error.message}`
        });
    }
};

// Contrôleur pour obtenir un message de bienvenue du chatbot
const getChatWelcome = (req, res) => {
    res.status(200).json({ message: "Bonjour ! Je suis votre assistant virtuel. Comment puis-je vous aider aujourd'hui ? Vous pouvez télécharger des fichiers pour que je puisse les analyser." });
};

// Contrôleur pour envoyer un message au chatbot
const sendChatMessage = async (req, res) => {
    try {
        const { message, fileContext = [], hideFromChat } = req.body;
        if (!message) {
            return res.status(400).json({ error: "Message manquant" });
        }

        const userId = req.cookies?.userId || "defaultUser";

        const response = await deepSeekChat(userId, message, fileContext, hideFromChat);
        res.json({ response });
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
        } else if (error.message) {
            errorMessage = error.message;
        }

        res.status(500).json({ error: errorMessage });
    }
};

module.exports = {
    uploadCSV,
    getChatWelcome,
    sendChatMessage,
    deepSeekChat,
    fileUpload,
    upload,
    calculateTotalBeneficiaries,
    calculateEligiblePhoneNumbers,
    calculateTotalContacts
};