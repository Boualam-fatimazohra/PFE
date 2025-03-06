const Evenement = require('../Models/evenement.model.js');
const Formateur = require('../Models/formateur.model.js');
const Coordinateur = require('../Models/coordinateur.model.js');
const mongoose = require('mongoose');

exports.checkEventOwnership = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { userId, role } = req.user;

    // Vérification ID événement
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID d'événement invalide" });
    }

    // Récupération de l'événement
    const evenement = await Evenement.findById(id);
    if (!evenement) {
      return res.status(404).json({ message: "Événement non trouvé" });
    }

    // Récupération organisateur selon le rôle
    let organisateur;
    switch(role) {
      case 'Formateur':
        organisateur = await Formateur.findOne({ utilisateur:userId });
        break;
      case 'Coordinateur':
        organisateur = await Coordinateur.findOne({ utilisateur:userId });
        break;
      case 'Admin':
        req.event = evenement; // Admin bypass
        return next();
      default:
        return res.status(403).json({ message: "Rôle non autorisé" });
    }

    // Vérification correspondance organisateur
    if (!organisateur || !evenement.organisateur.equals(organisateur._id)) {
      return res.status(403).json({ 
        message: "Non autorisé à modifier cet événement" 
      });
    }

    req.event = evenement;
    next();
  } catch (error) {
    console.error('Erreur middleware checkEventOwnership:', error);
    res.status(500).json({ message: "Erreur d'autorisation", error: error.message });
  }
};