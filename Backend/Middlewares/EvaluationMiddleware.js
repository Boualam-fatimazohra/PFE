const BeneficiareFormation = require("../Models/beneficiairesFormation.js");

const checkSubmission = async (req, res, next) => {
  try {
    const { token } = req.params; 
    if (!token) {
      return res.status(400).json({ message: "Token manquant" });
    }

    // Chercher l'instance correspondant au token
    const beneficiaireFormation = await BeneficiareFormation.findOne({ token });

    if (!beneficiaireFormation) {
      return res.status(404).json({ message: "Token invalide ou introuvable" });
    }

    if (beneficiaireFormation.isSubmited) {
      return res.status(403).json({ message: "Réponse déjà enregistrée, vous ne pouvez pas soumettre à nouveau." });
    }

    next();
  } catch (error) {
    console.error("Erreur lors de la vérification du token:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

module.exports = checkSubmission;
