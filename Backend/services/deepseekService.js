const axios = require('axios');

// Stockage des historiques de conversation par utilisateur
const userConversations = {};

// Fonction pour interagir avec DeepSeek API
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
                        timeout: 60000 // Timeout de 60 secondes
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

module.exports = {
    deepSeekChat
};