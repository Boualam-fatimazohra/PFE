const { sendMail } = require('../Config/auth.js');

// Adresse email destinataire pour le test
const destinataire = "saloua.ouissa@edu.uiz.ac.ma";

// Contenu HTML pour le test
const contenuHTML = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Email de test</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6;">
    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #333;">Test d'envoi d'email</h2>
        
        <p>Ceci est un test d'envoi d'email depuis Node.js avec OAuth2.</p>
        
        <p>Si vous recevez cet email, la configuration fonctionne correctement !</p>
        
        <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
        <p style="color: #777; font-size: 12px;">Email généré automatiquement pour tester la fonction d'envoi.</p>
    </div>
</body>
</html>
`;

// Fonction asynchrone pour exécuter le test
async function runTest() {
    try {
        console.log("Démarrage du test d'envoi d'email...");
        const result = await sendMail(destinataire, contenuHTML);
        console.log("Test réussi !", result);
    } catch (error) {
        console.error("Échec du test :", error.message);
    }
}

// Exécution du test
runTest();