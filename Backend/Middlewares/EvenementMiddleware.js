const Evenement = require('../Models/evenement.model.js');
const mongoose = require('mongoose');

exports.checkEventOwnership = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;
    const userRole = req.user.role;
    // Vérification de l'ID MongoDB
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'ID d\'événement invalide' });
    }
    // Recherche de l'événement
    const evenement = await Evenement.findById(id);
    if (!evenement) {
      return res.status(404).json({ message: 'Événement non trouvé' });
    }
    // Stockage de l'événement dans req pour utilisation dans le contrôleur
    req.evenement = evenement;
    // Managers peuvent modifier n'importe quel événement
    if (userRole === 'Manager') {
      console.log('Manager autorisé à modifier l\'événement');
      return next();
    }
    // Autres rôles doivent être le créateur
    if (evenement.createdBy.toString() !== userId) {
      console.log('Accès refusé: l\'utilisateur n\'est pas le créateur');
      return res.status(403).json({
        message: 'Vous n\'êtes pas autorisé à modifier cet événement'
      });
    }
    console.log('Créateur autorisé à modifier l\'événement');
    next();
  } catch (error) {
    console.error('Erreur dans le middleware checkEventOwnership:', error);
    return res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};