const Evenement = require('../Models/evenement.model');
const Formateur = require('../Models/formateur.model');
const Coordinateur = require('../Models/coordinateur.model');
const mongoose = require('mongoose');

// Récupérer tous les événements
exports.getAllEvenements = async (req, res) => {
  try {
    const evenements = await Evenement.find()
      .populate('organisateur');
    
    res.status(200).json(evenements);
  } catch (error) {
    console.error('Erreur lors de la récupération des événements:', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
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

// Ajouter un nouvel événement
exports.addEvenement = async (req, res) => {
  try {
    const { 
      dateDebut, 
      dateFin, 
      heureDebut, 
      heureFin, 
      sujet
    } = req.body;
    
    const  utilisateurId = req.user.userId;
    const role =req.user.role;  
    
    // Vérifier si l'ID utilisateur est valide
    if (!mongoose.Types.ObjectId.isValid(utilisateurId)) {
      return res.status(400).json({ message: 'ID utilisateur invalide' });
    }
    
    // Déterminer le type d'organisateur et récupérer son ID en fonction du rôle
    let organisateurType, organisateur;
    
    if (role === 'Formateur') {
      organisateurType = 'Formateur';
      const formateurDoc = await Formateur.findOne({ utilisateur: utilisateurId });
      
      if (!formateurDoc) {
        return res.status(404).json({ message: 'Formateur non trouvé pour cet utilisateur' });
      }
      
      organisateur = formateurDoc._id;
    } 
    else if (role === 'Coordinateur') {
      organisateurType = 'Coordinateur';
      const coordinateurDoc = await Coordinateur.findOne({ utilisateur: utilisateurId });
      
      if (!coordinateurDoc) {
        return res.status(404).json({ message: 'Coordinateur non trouvé pour cet utilisateur' });
      }
      
      organisateur = coordinateurDoc._id;
    }
    else {
      return res.status(403).json({ message: 'Rôle non autorisé pour créer un événement' });
    }
    
    // Créer le nouvel événement
    const nouvelEvenement = new Evenement({
      dateDebut,
      dateFin,
      heureDebut,
      heureFin,
      sujet,
      organisateurType,
      organisateur
    });
    
    // Sauvegarder l'événement
    await nouvelEvenement.save();
    
    // Récupérer l'événement complet avec les références peuplées
    const evenementSauvegarde = await Evenement.findById(nouvelEvenement._id)
      .populate('organisateur');
    
    res.status(201).json({ 
      message: 'Événement créé avec succès', 
      evenement: evenementSauvegarde 
    });
  } catch (error) {
    console.error('Erreur lors de la création de l\'événement:', error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        message: 'Données d\'événement invalides', 
        error: error.message 
      });
    }
    
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Mettre à jour un événement
exports.updateEvenement = async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      dateDebut, 
      dateFin, 
      heureDebut, 
      heureFin, 
      sujet 
    } = req.body;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'ID d\'événement invalide' });
    }
    
    // Vérifier si l'événement existe
    const evenementExistant = await Evenement.findById(id);
    if (!evenementExistant) {
      return res.status(404).json({ message: 'Événement non trouvé' });
    }
    
    // Vérifier si l'utilisateur est autorisé à modifier cet événement
    const utilisateurId = req.user.userId;
    const role=req.user.role;
    if (role === 'Formateur') {
      const formateur = await Formateur.findOne({ utilisateur: utilisateurId });
      utilisateurOrganisateur = formateur?._id;
    } else if (role === 'Coordinateur') {
      const coordinateur = await Coordinateur.findOne({ utilisateur: utilisateurId });
      utilisateurOrganisateur = coordinateur?._id;
    }
    // Mettre à jour l'événement
    const evenementMisAJour = await Evenement.findByIdAndUpdate(
      id,
      {
        dateDebut,
        dateFin,
        heureDebut,
        heureFin,
        sujet
      },
      { new: true, runValidators: true }
    ).populate('organisateur');
    
    res.status(200).json({ 
      message: 'Événement mis à jour avec succès', 
      evenement: evenementMisAJour 
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'événement:', error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        message: 'Données d\'événement invalides', 
        error: error.message 
      });
    }
    
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
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
    const { utilisateurId, role } = req.user;
    
    // Vérifier si l'ID utilisateur est valide
    if (!mongoose.Types.ObjectId.isValid(utilisateurId)) {
      return res.status(400).json({ message: 'ID utilisateur invalide' });
    }
    
    let organisateurId;
    let organisateurType;
    
    // Déterminer le type d'organisateur et son ID
    if (role === 'Formateur') {
      organisateurType = 'Formateur';
      const formateur = await Formateur.findOne({ utilisateur: utilisateurId });
      
      if (!formateur) {
        return res.status(404).json({ message: 'Formateur non trouvé' });
      }
      
      organisateurId = formateur._id;
    } 
    else if (role === 'Coordinateur') {
      organisateurType = 'Coordinateur';
      const coordinateur = await Coordinateur.findOne({ utilisateur: utilisateurId });
      
      if (!coordinateur) {
        return res.status(404).json({ message: 'Coordinateur non trouvé' });
      }
      
      organisateurId = coordinateur._id;
    }
    else {
      return res.status(403).json({ message: 'Rôle non autorisé' });
    }
    
    // Rechercher les événements où l'utilisateur est l'organisateur
    const evenements = await Evenement.find({
      organisateurType: organisateurType,
      organisateur: organisateurId
    }).populate('organisateur');
    
    res.status(200).json(evenements);
  } catch (error) {
    console.error('Erreur lors de la récupération des événements:', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};