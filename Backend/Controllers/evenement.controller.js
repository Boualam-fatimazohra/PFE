const Evenement = require('../Models/evenement.model');
const Formateur = require('../Models/formateur.model');
const Coordinateur = require('../Models/coordinateur.model');
const mongoose = require('mongoose');

// Récupérer tous les événements
exports.getAllEvenements = async (req, res) => {
  try {
    const evenements = await Evenement.find()
      .populate('organisateur')
      .sort({ dateDebut: -1 }); // Tri par date de début (plus récent d'abord)
    
    // Gestion du cas où aucun événement n'est trouvé
    if (evenements.length === 0) {
      return res.status(200).json({
        message: 'Aucun événement n\'est disponible actuellement',
        evenements: []
      });
    }
    
    // Réponse avec message de succès et compteur
    res.status(200).json({
      message: 'Événements récupérés avec succès',
      count: evenements.length,
      evenements: evenements
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des événements:', error);
    res.status(500).json({ 
      message: 'Erreur lors de la récupération des événements', 
      error: error.message 
    });
  }
};
// Récupérer un événement par ID
exports.getEvenementById = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'ID d\'événement invalide' });
    }
    
    const evenement = await Evenement.findById(id)
      .populate('organisateur');
    
    if (!evenement) {
      return res.status(404).json({ message: 'Événement non trouvé' });
    }
    
    res.status(200).json(evenement);
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'événement:', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Ajouter un nouvel événement : s'il s'agit d'un formateur : createdBy=orgnisedBy si un Coordinateur je cherche est ce qu'il a spécifier l'orginsateur si non donc c'est lui meme
exports.createEvenement = async (req, res) => {
  try {
    const user = req.user;
    const { organisateur, ...eventData } = req.body;
    // Initialisation des variables
    let organisateurId;
    let isValidate = false;
    if (user.role === 'Manager') {
      // Si c'est un manager
      // Utiliser l'organisateur du body s'il existe, sinon utiliser le manager lui-même
      organisateurId = organisateur || user.userId;
      isValidate = true; // Un manager peut valider directement
    } else if (user.role === 'Coordinateur' || user.role === 'Formateur') {
      // Si c'est un coordinateur ou formateur
      organisateurId = user.userId; // L'organisateur est toujours l'utilisateur lui-même
      isValidate = false; // Nécessite validation par un manager
    } else {
      // Pour les autres rôles non spécifiés
      organisateurId = user.userId;
      isValidate = false;
    }
    // Création de l'événement
    const nouvelEvenement = new Evenement({
      ...eventData,
      createdBy: user.userId,
      organisateur: organisateurId,
      isValidate: isValidate
    });
    
    await nouvelEvenement.save();
    // Logique d'envoi de notification 
    if (!isValidate) {
      // Envoyer notification au manager
    }
    res.status(201).json(nouvelEvenement);
  } catch (error) {
    res.status(400).json({
      message: error.message,
      details: error.errors
    });
  }
};
// Mettre à jour un événement réuissi en passant par le middleware
exports.updateEvenement = async (req, res) => {
  try {
    const {id}=req.params;
    const updateData = { ...req.body };
    const evenementMisAJour = await Evenement.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate('organisateur');
    res.status(200).json({
      message: 'Événement mis à jour avec succès',
      evenement: evenementMisAJour
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
      details: error.errors
    });
   }
};
// Supprimer un événement
exports.deleteEvenement = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'ID d\'événement invalide' });
    }
    // Vérifier si l'événement existe
    const evenementExistant = await Evenement.findById(id);
    if (!evenementExistant) {
      return res.status(404).json({ message: 'Événement non trouvé' });
    }
    // Supprimer l'événement
    await Evenement.findByIdAndDelete(id);
    res.status(200).json({ 
      message: 'Événement supprimé avec succès',
      evenementId: id
    });
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'événement:', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Récupérer les événements d'un utilisateur spécifique (formateur ou coordinateur)
exports.getMesEvenements = async (req, res) => {
  try {
    const userId = req.user.userId;
    // Recherche des événements où l'utilisateur est le créateur ou l'organisateur
    const evenements = await Evenement.find({
      $or: [
        { createdBy: userId },
        { organisateur: userId }
      ]
    }).populate('organisateur')
      .sort({ dateDebut: -1 }); // Tri par date de début, du plus récent au plus ancien
    
    // Si aucun événement n'est trouvé, renvoyer un tableau vide avec un message
    if (evenements.length === 0) {
      return res.status(200).json({
        message: 'Aucun événement trouvé pour cet utilisateur',
        evenements: []
      });
    }
    
    res.status(200).json({
      count: evenements.length,
      evenements: evenements
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des événements:', error);
    res.status(500).json({
      message: 'Erreur lors de la récupération des événements',
      error: error.message
    });
  }
};
exports.getEvenementByMonth = async (req, res) => {
  try {
    const { month } = req.body;
    
    if (!month) {
      return res.status(400).json({ 
        success: false, 
        message: "Le mois est requis dans le corps de la requête" 
      });
    }

    // Conversion du mois en date de début et fin
    const [year, monthNum] = month.split('-').map(Number);
    
    if (isNaN(year) || isNaN(monthNum) || monthNum < 1 || monthNum > 12) {
      return res.status(400).json({ 
        success: false, 
        message: "Format de mois invalide. Utilisez YYYY-MM" 
      });
    }

    const startOfMonth = new Date(year, monthNum - 1, 1);
    const endOfMonth = new Date(year, monthNum, 1);

    // Recherche des événements qui chevauchent le mois
    const countInMonth = await Evenement.countDocuments({
      $and: [
        { dateDebut: { $lt: endOfMonth } },
        { dateFin: { $gte: startOfMonth } }
      ]
    });

    // Calcul du total de tous les événements
    const totalCount = await Evenement.countDocuments({});

    res.status(200).json({
      success: true,
      countInMonth,
      totalCount
    });

  } catch (error) {
    console.log("erreur a partir de getEvenemntByMonth");
    res.status(500).json({
      success: false,
      message: error.message || "Une erreur est survenue"
    });
  }
};