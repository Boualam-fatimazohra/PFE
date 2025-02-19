const generateToken=require("./generateToken");
const { sendMail } = require("../Config/auth.js");

const sendEvaluationLinkWithToken = async (email, formationId) => {
    try {
      const token = generateToken();
      const evaluationLink = `${process.env.FRONTEND_URL}/evaluation?token=${token}&formationId=${formationId}`;
      const emailContent = `
        <p>Bonjour,</p>
        <p>Vous avez été invité à remplir l'évaluation pour la formation suivante :</p>
        <p><strong>Formation ID : ${formationId}</strong></p>
        <p>Veuillez cliquer sur le lien suivant pour accéder à l'évaluation :</p>
        <a href="${evaluationLink}">Remplir l'évaluation</a>
        <p>Cordialement,</p>
        <p>L'équipe de formation</p>
      `;
  
      // . Envoyer l'email avec le lien
      await sendMail(email, emailContent); 
  
      // . Retourner le token généré
      return token;
  
    } catch (error) {
      console.error("Erreur lors de l'envoi du lien d'évaluation avec token :", error);
      throw error;
    }
  };
  module.exports = { sendEvaluationLinkWithToken };
