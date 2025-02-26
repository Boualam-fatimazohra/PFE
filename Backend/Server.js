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
const deepSeekChat = async (userId, message, fileContext = []) => {
    try {
        if (!userConversations[userId]) {
            userConversations[userId] = [];
        }
        
        // Construire le message avec le contexte des fichiers si nécessaire
        let contextualizedMessage = message;
        
        if (fileContext && fileContext.length > 0) {
            // Vérifier si fileContext contient des données valides
            const validFiles = fileContext.filter(file => 
                file && file.name && file.data && typeof file.data === 'string' && file.data.trim().length > 0
            );
            
            if (validFiles.length > 0) {
                contextualizedMessage = "";
                
                // Ajouter chaque fichier au contexte
                validFiles.forEach((file, index) => {
                    contextualizedMessage += `### DÉBUT DU FICHIER ${index + 1}: ${file.name} ###\n${file.data}\n### FIN DU FICHIER ${index + 1}: ${file.name} ###\n\n`;
                });
                
                // Ajouter la question
                contextualizedMessage += `Question: ${message}`;
            }
        }
        
        userConversations[userId].push({ role: "user", content: contextualizedMessage });

        const response = await axios.post(
            "https://api.deepseek.com/v1/chat/completions",
            {
                model: "deepseek-chat",
                messages: userConversations[userId],
                temperature: 0.7,
                top_p: 0.95
            },
            {
                headers: {
                    "Authorization": `Bearer ${process.env.DEEPSEEK_API_KEY}`,
                    "Content-Type": "application/json"
                }
            }
        );
        
        const botResponse = response.data.choices[0].message.content;
        userConversations[userId].push({ role: "assistant", content: botResponse });
        
        return botResponse;
    } catch (error) {
        console.error("Erreur DeepSeek API:", error);
        throw new Error("Impossible de récupérer une réponse de l'API DeepSeek");
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
app.use("/api/beneficiaires", beneficiaireRoutes);
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