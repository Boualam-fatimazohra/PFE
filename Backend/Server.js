const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./Config/config.js");
const Auth = require("./Routes/auth.route.js");
const formationRoutes = require("./Routes/formation.route.js");
const formateurRoutes = require("./Routes/formateur.route.js");
const beneficiaireRoutes = require("./Routes/beneficiaire.route.js");
const coordinateurRoutes = require("./Routes/coordinateur.route.js");
const managerRoutes = require("./Routes/manager.route.js");
const evaluationRoutes =require("./Routes/evaluation.route.js");
const multer = require("multer");
const fs = require("fs");
const cookieParser = require("cookie-parser");
const path = require("path");
const axios = require("axios");
const bodyParser = require("body-parser");

dotenv.config();

// Initialiser l'application Express d'abord
const app = express();
const PORT = process.env.PORT || 5000;

// Stockage des historiques de conversation par utilisateur
const userConversations = {};

// Fonction pour interagir avec DeepSeek API
// const deepSeekChat = async (userId, message, fileContext = []) => {
//     try {
//         if (!userConversations[userId]) {
//             userConversations[userId] = [];
//         }
        
//         // Construire le message avec le contexte des fichiers si nécessaire
//         let contextualizedMessage = message;
        
//         if (fileContext && fileContext.length > 0) {
//             // Vérifier si fileContext contient des données valides
//             const validFiles = fileContext.filter(file => 
//                 file && file.name && file.data && typeof file.data === 'string' && file.data.trim().length > 0
//             );
            
//             if (validFiles.length > 0) {
//                 contextualizedMessage = "";
                
//                 // Ajouter chaque fichier au contexte
//                 validFiles.forEach((file, index) => {
//                     contextualizedMessage += `### DÉBUT DU FICHIER ${index + 1}: ${file.name} ###\n${file.data}\n### FIN DU FICHIER ${index + 1}: ${file.name} ###\n\n`;
//                 });
                
//                 // Ajouter la question
//                 contextualizedMessage += `Question: ${message}`;
//             }
//         }
        
//         userConversations[userId].push({ role: "user", content: contextualizedMessage });

//         const response = await axios.post(
//             "https://api.deepseek.com/v1/chat/completions",
//             {
//                 model: "deepseek-chat",
//                 messages: userConversations[userId],
//                 temperature: 0.7,
//                 top_p: 0.95
//             },
//             {
//                 headers: {
//                     "Authorization": `Bearer ${process.env.DEEPSEEK_API_KEY}`,
//                     "Content-Type": "application/json"
//                 }
//             }
//         );
        
//         const botResponse = response.data.choices[0].message.content;
//         userConversations[userId].push({ role: "assistant", content: botResponse });
        
//         return botResponse;
//     } catch (error) {
//         console.error("Erreur DeepSeek API:", error);
//         throw new Error("Impossible de récupérer une réponse de l'API DeepSeek");
//     }
// };// Fonction pour interagir avec DeepSeek API
const deepSeekChat = async (userId, message, fileContext = []) => {
    try {
        // Initialiser la conversation pour l'utilisateur si elle n'existe pas
        if (!userConversations[userId]) {
            userConversations[userId] = [];
        }
        
        // Construire le message avec le contexte des fichiers si nécessaire
        let contextualizedMessage = message;
        let systemMessage = { 
            role: "system", 
            content: "Vous êtes un assistant virtuel spécialisé dans l'analyse de données et l'aide aux utilisateurs."
        };
        
        // Si des fichiers sont fournis, les ajouter au contexte
        if (fileContext && fileContext.length > 0) {
            // Vérifier si fileContext contient des données valides
            const validFiles = fileContext.filter(file => 
                file && file.name && file.data && typeof file.data === 'string' && file.data.trim().length > 0
            );
            
            if (validFiles.length > 0) {
                systemMessage.content += " Veuillez analyser attentivement les fichiers fournis et répondre de manière précise.";
                contextualizedMessage = "";
                
                // Ajouter chaque fichier au contexte
                validFiles.forEach((file, index) => {
                    contextualizedMessage += `### DÉBUT DU FICHIER ${index + 1}: ${file.name} ###\n${file.data}\n### FIN DU FICHIER ${index + 1}: ${file.name} ###\n\n`;
                });
                
                // Ajouter la question
                contextualizedMessage += `Question: ${message}`;
                console.log(`Envoi à DeepSeek: ${validFiles.length} fichiers inclus`);
            }
        }
        
        // Créer les messages pour l'API avec un message système
        const messages = [
            systemMessage,
            ...userConversations[userId],
            { role: "user", content: contextualizedMessage }
        ];
        
        // Vérifier que la clé API existe
        if (!process.env.DEEPSEEK_API_KEY || process.env.DEEPSEEK_API_KEY.trim() === '') {
            throw new Error("Clé API DeepSeek manquante dans les variables d'environnement");
        }
        
        console.log(`Envoi à DeepSeek - Nombre de messages: ${messages.length}`);
        
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
                        temperature: 0.7,
                        top_p: 0.95,
                        max_tokens: 2000 // Limiter la taille de la réponse
                    },
                    {
                        headers: {
                            "Authorization": `Bearer ${process.env.DEEPSEEK_API_KEY}`,
                            "Content-Type": "application/json"
                        },
                        timeout: 60000 // Timeout de 30 secondes
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
        
        // Stocker la conversation (seulement le message utilisateur et la réponse)
        userConversations[userId].push({ role: "user", content: contextualizedMessage });
        userConversations[userId].push({ role: "assistant", content: botResponse });
        
        // Limiter la taille de l'historique (max 10 derniers échanges = 20 messages)
        if (userConversations[userId].length > 20) {
            userConversations[userId] = userConversations[userId].slice(-20);
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

// Configuration de l'application
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(
    cors({
        origin: "http://localhost:8080",
        credentials: true,
        methods: "GET,POST,PUT,DELETE",
        allowedHeaders: "Content-Type,Authorization",
    })
);

// Connexion à la base de données
connectDB();

// Configuration des dossiers d'uploads
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)){
    fs.mkdirSync(uploadsDir, { recursive: true });
}

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Configuration du stockage multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, "uploads/"),
    filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage: storage });

// Routes d'API
app.use("/api/auth", Auth);
app.use("/api/formation", formationRoutes);
app.use("/api/beneficiaires",beneficiaireRoutes);
app.use("/api/coordinateurs", coordinateurRoutes);
app.use("/api/managers", managerRoutes);
app.use("/api/formateur",formateurRoutes);
app.use("/api/evaluation",evaluationRoutes);
app.use("/api/formation/Addformation", formationRoutes);

// Route pour télécharger des fichiers
app.post("/upload-csv", upload.single("csvFile"), (req, res) => {
    if (!req.file) return res.status(400).json({ success: false, error: "Aucun fichier envoyé" });

    const filePath = req.file.path;
    fs.readFile(filePath, "utf8", (err, data) => {
        if (err) return res.status(500).json({ success: false, error: "Erreur lecture fichier" });
        
        res.json({ success: true, data: data.substring(0, 1000), name: req.file.originalname });
    });
});

// Routes du chatbot
app.get('/chat', (req, res) => {
    res.status(200).json({ message: "Bonjour ! Je suis votre assistant virtuel. Comment puis-je vous aider aujourd'hui ?" });
});

// Route pour envoyer un message avec contexte de fichier
app.post('/chat', async (req, res) => {
    const { message, fileContext = [] } = req.body;
    if (!message) {
        return res.status(400).json({ error: "Message manquant" });
    }

    const userId = req.cookies?.userId || "defaultUser";

    try {
        const response = await deepSeekChat(userId, message, fileContext);
        res.json({ response });
    } catch (error) {
        console.error("Erreur dans le chatbot :", error);
        res.status(500).json({ error: "Erreur du serveur lors du traitement de votre demande. Veuillez réessayer." });
    }
});

// Middleware de gestion des erreurs
app.use((err, req, res, next) => {
    console.error("Erreur serveur:", err);
    res.status(500).json({ error: "Une erreur est survenue sur le serveur", message: process.env.NODE_ENV === 'development' ? err.message : undefined });
});

// Démarrage du serveur
app.listen(PORT, () => {
    console.log(`✅ Serveur démarré sur http://localhost:${PORT}`);
});