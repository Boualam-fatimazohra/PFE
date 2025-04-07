const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const fs = require('fs');
const path = require('path');
const QRCode = require('qrcode');


// Vérification des variables d'environnement
if (!process.env.CLIENT_ID || !process.env.CLIENT_SECRET || 
    !process.env.REDIRECT_URI || !process.env.REFRESH_TOKEN || 
    !process.env.JWT_SECRET) {
    console.error("Une ou plusieurs variables d'environnement sont manquantes !");
}

// Création du client OAuth2
const oAuth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.REDIRECT_URI
);
oAuth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });

// Variables pour gérer le token OAuth2
let lastAccessToken = null;
let tokenExpirationTime = 0;

// Fonction pour obtenir un token d'accès valide
const getAccessToken= async ()=> {
    try {
        const currentTime = Date.now();
        
        // Si nous avons déjà un token valide, le renvoyer
        if (lastAccessToken && currentTime < tokenExpirationTime - 300000) { // 5 minutes avant expiration
            console.log("Utilisation du token d'accès en cache");
            return lastAccessToken;
        }
        
        console.log("Récupération d'un nouveau token d'accès...");
        const { token, res } = await oAuth2Client.getAccessToken();
        
        if (!token) {
            throw new Error("Impossible d'obtenir un token d'accès.");
        }
        
        // Stocker le token et calculer son temps d'expiration
        lastAccessToken = token;
        
        // Si res.data.expires_in existe, l'utiliser pour calculer l'expiration
        // Sinon, définir une durée par défaut de 1 heure (3600 secondes)
        const expiresIn = (res && res.data && res.data.expires_in) ? res.data.expires_in : 3600;
        tokenExpirationTime = currentTime + (expiresIn * 1000);
        
        console.log(`Token d'accès obtenu ! Expire dans ${expiresIn} secondes`);
        return token;
    } catch (error) {
        console.error("Erreur lors de la récupération du token d'accès :", error.message);
        
        // Si l'erreur est liée à un refresh token expiré
        if (error.message.includes('invalid_grant') || error.message.includes('expired')) {
            console.error("Le refresh token semble être expiré. Veuillez le renouveler.");
        }
        
        throw new Error("Erreur d'authentification : impossible d'obtenir un token d'accès.");
    }
}

// Fonction améliorée pour envoyer un email avec pièce jointe
const sendMailWithAttachment= async(destinataire, sujet, contenuHTML, attachments = [])=> {
    try {
        console.log(`Début d'envoi d'email à : ${destinataire}`);
        
        // Récupérer un nouveau token d'accès
        const accessToken = await getAccessToken();
        
        // Vérifier si le token est valide
        if (!accessToken) {
            console.error("Token OAuth2 non valide.");
            throw new Error("Erreur d'authentification : token non valide.");
        }
        
        // Création du transport Nodemailer
        const transport = nodemailer.createTransport({
            service: "gmail",
            auth: {
                type: "OAuth2",
                user: "salouaouissa2002@gmail.com",
                clientId: process.env.CLIENT_ID,
                clientSecret: process.env.CLIENT_SECRET,
                refreshToken: process.env.REFRESH_TOKEN,
                accessToken: accessToken,
            },
        });
        
        // Options de l'email avec pièces jointes
        const mailOptions = {
            from: "Ouissa Saloua <salouaouissa2002@gmail.com>",
            to: destinataire,
            subject: sujet,
            html: contenuHTML,
            attachments: attachments
        };
        
        // Envoi de l'email
        const result = await transport.sendMail(mailOptions);
        console.log(`Email envoyé avec succès à : ${destinataire}`);
        return result;
      } catch (error){
        console.error("Erreur lors de l'envoi de l'email :", error.message);
        throw new Error("Échec de l'envoi de l'email : " + error.message);
    }
}

// Fonction spécifique pour envoyer un QR Code par email
const sendQRCodeByEmail = async (beneficiaire, formation, qrCodeToken) => {
    try {
        console.log(`Préparation de l'envoi du QR code à ${beneficiaire.email}...`);
        
        // Créer un dossier temporaire s'il n'existe pas
        const tempDir = path.join(__dirname, '../temp');
        if (!fs.existsSync(tempDir)) {
            fs.mkdirSync(tempDir, { recursive: true });
        }
        
        // Chemin du fichier QR code temporaire
        const qrCodeFilePath = path.join(tempDir, `qrcode-${beneficiaire._id}-${formation._id}.png`);
        
        // Générer le QR code comme un fichier PNG
        await QRCode.toFile(qrCodeFilePath, qrCodeToken);
        
        // Contenu HTML de l'email
        const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>Votre QR Code pour la formation</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                <h2 style="color: #333;">Bonjour ${beneficiaire.prenom} ${beneficiaire.nom},</h2>
                
                <p>Vous êtes invité(e) à participer à la formation "${formation.nom}" qui aura lieu du ${new Date(formation.dateDebut).toLocaleDateString()} au ${new Date(formation.dateFin).toLocaleDateString()}.</p>
                
                <p>Veuillez trouver ci-joint un QR code à présenter lors de votre arrivée pour confirmer votre présence.</p>
                
                <p>À bientôt !</p>
                
                <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
                <p style="color: #777; font-size: 12px;">Ce message contient un code QR personnel. Ne le partagez pas.</p>
            </div>
        </body>
        </html>
        `;
        
        // Préparation des pièces jointes
        const attachments = [
            {
                filename: 'votre-qrcode.png',
                path: qrCodeFilePath,
                cid: 'qrcode@formation' // CID pour référencer l'image dans le HTML si nécessaire
            }
        ];
        
        // Envoi de l'email avec la pièce jointe
        await sendMailWithAttachment(
            beneficiaire.email,
            `QR Code pour votre formation: ${formation.nom}`,
            htmlContent,
            attachments
        );
        
        // Suppression du fichier temporaire après envoi
        if (fs.existsSync(qrCodeFilePath)) {
            fs.unlinkSync(qrCodeFilePath);
            console.log(`Fichier temporaire ${qrCodeFilePath} supprimé.`);
        }
        
        return true;
    } catch (error) {
        console.error("Erreur lors de l'envoi du QR code par email:", error);
        throw error;
    }
};
module.exports={sendQRCodeByEmail}