const express = require('express');
const router = express.Router();
const { deepSeekChat } = require('../services/deepseekService');

// Route simple pour obtenir un message de bienvenue
router.get('/', (req, res) => {
    res.status(200).json({ 
        message: "Bonjour ! Je suis votre assistant virtuel. Comment puis-je vous aider aujourd'hui ?" 
    });
});

// Route pour envoyer un message avec contexte de fichier
router.post('/', async (req, res) => {
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
        res.status(500).json({ 
            error: "Erreur du serveur lors du traitement de votre demande. Veuillez réessayer."
        });
    }
});

module.exports = router;