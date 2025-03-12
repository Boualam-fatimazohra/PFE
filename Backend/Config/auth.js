const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const dotenv = require("dotenv");

// Chargement des variables d'environnement
const envConfig = dotenv.config();
if (envConfig.error) {
    console.error(" Erreur lors du chargement du fichier .env :", envConfig.error);
} else {
    console.log("Fichier .env chargé avec succès !");
}

// Vérification des variables d'environnement
console.log("🔍 Vérification des variables d'environnement :");
console.log("CLIENT_ID:", process.env.CLIENT_ID || " NON DÉFINI");
console.log("CLIENT_SECRET:", process.env.CLIENT_SECRET ? "OK" : " NON DÉFINI");
console.log("REDIRECT_URI:", process.env.REDIRECT_URI || " NON DÉFINI");
console.log("REFRESH_TOKEN:", process.env.REFRESH_TOKEN ? " OK" : "NON DÉFINI");

// Récupération des variables d'environnement
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;

// Vérification après récupération
if (!CLIENT_ID || !CLIENT_SECRET || !REDIRECT_URI || !REFRESH_TOKEN) {
    console.error(" Une ou plusieurs variables d'environnement sont manquantes !");
    process.exit(1); // Arrêter le script si des variables sont absentes
}

// Création du client OAuth2
const oAuth2Client = new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URI
);
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

async function getAccessToken() {
    try {
        console.log(" Récupération du token d'accès...");
        const { token } = await oAuth2Client.getAccessToken();
        
        if (!token) {
            throw new Error(" Impossible d'obtenir un token d'accès.");
        }

        console.log(" Token d'accès obtenu !");
        return token;
    } catch (error) {
        console.error(" Erreur lors de la récupération du token d'accès :", error.message);
        throw new Error("Erreur d'authentification : impossible d'obtenir un token d'accès.");
    }
}

async function sendMail(destinataire, contenu) {
    try {
        console.log(` Début d'envoi d'email à : ${destinataire}`);

        // Récupérer un nouveau token d'accès
        const accessToken = await getAccessToken();

        // Vérifier si le token est valide
        if (!accessToken) {
            console.error(" Token OAuth2 non valide.");
            throw new Error("Erreur d'authentification : token non valide.");
        }

        // Création du transport Nodemailer
        const transport = nodemailer.createTransport({
            service: "gmail",
            auth: {
                type: "OAuth2",
                user: "salouaouissa2002@gmail.com",
                clientId: CLIENT_ID,
                clientSecret: CLIENT_SECRET,
                refreshToken: REFRESH_TOKEN,
                accessToken: accessToken,
            },
        });
        console.log("Contenu de l'email :", contenu);
        const mailOptions = {
            from: "Ouissa Saloua <salouaouissa2002@gmail.com>",
            to: destinataire,
            subject: "Votre mot de passe",
            text: contenu,
            html: contenu,
        };

        // Envoi de l'email
        const result = await transport.sendMail(mailOptions);
        console.log(` Email envoyé avec succès à : ${destinataire}`);
        return result;
    } catch (error) {
        console.error(" Erreur lors de l'envoi de l'email :", error.message);
        throw new Error("Échec de l'envoi de l'email. Veuillez réessayer plus tard.");
    }
}

module.exports = { sendMail };
