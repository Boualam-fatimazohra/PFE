const generateToken = require("./generateToken");
const { sendMail } = require("../Config/auth.js");

const sendEvaluationLinkWithToken = async (email, formationId) => {
  try {
    const token = generateToken();
    const evaluationLink = `http://localhost:8080/formulaire-evaluation/${formationId}/${token}`;
    console.log("Lien d'évaluation généré :", evaluationLink);  
    // Créer un contenu email en HTML avec un bouton cliquable
    const emailContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        .button {
          background-color: #FF7900;
          color: white;
          padding: 10px 20px;
          text-decoration: none;
          border-radius: 5px;
          font-weight: bold;
          display: inline-block;
          margin: 20px 0;
        }
        .container {
          font-family: Arial, sans-serif;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          border: 1px solid #ddd;
          border-radius: 5px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h2>Évaluation de la formation</h2>
        <p>Bonjour,</p>
        <p>Vous avez été invité à remplir l'évaluation pour la formation suivante :</p>
        <p><strong>Formation ID :</strong> ${formationId}</p>
        <p>Veuillez cliquer sur le bouton ci-dessous pour accéder à l'évaluation :</p>
        <a href="${evaluationLink}" class="button">Remplir l'évaluation</a>
        <p>Ou copiez et collez ce lien dans votre navigateur :</p>
        <p>${evaluationLink}</p>
        <p>Cordialement,<br>L'équipe de formation</p>
      </div>
    </body>
    </html>
    `;

    // Envoyer l'email avec le lien
    console.log(`Envoi d'un email à ${email} avec le lien: ${evaluationLink}`);
    await sendMail(email, emailContent);

    
    // Retourner le token généré
    return token;
  } catch (error) {
    console.error("Erreur lors de l'envoi du lien d'évaluation avec token :", error);
    throw error;
  }
};

module.exports = { sendEvaluationLinkWithToken };