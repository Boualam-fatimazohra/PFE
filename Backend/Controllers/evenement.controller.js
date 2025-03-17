const Evenement = require('../Models/evenement.model');
const Manager  = require('../Models/manager.model');
const Formateur = require('../Models/formateur.model');
const Coordinateur = require('../Models/coordinateur.model');
const Notification = require('../Models/notification.model');
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
    const userId = req.user.userId;
    const userRole = req.user.role;
    const eventData = req.body;
    
    // If user is a Manager, create event directly with isValidate=true
    if (userRole === 'Manager') {
      const nouvelEvenement = new Evenement({
        ...eventData,
        createdBy: userId,
        organisateur: eventData.organisateur || userId,
        isValidate: true // Managers can create pre-validated events
      }); 
      
      const savedEvent = await nouvelEvenement.save();
      
      return res.status(201).json({
        message: 'Événement créé avec succès',
        evenement: savedEvent
      });
    }
    
    // For Formateur or Coordinateur, create event with isValidate=false
    // Find the manager of the formateur/coordinateur
    let managerId;
    
    if (userRole === 'Formateur') {
      const formateur = await Formateur.findOne({ utilisateur: userId }).populate('manager');
      if (!formateur || !formateur.manager) {
        return res.status(404).json({ message: 'Manager not found for this formateur' });
      }
      managerId = formateur.manager.utilisateur;
    } else if (userRole === 'Coordinateur') {
      const coordinateur = await Coordinateur.findOne({ utilisateur: userId }).populate('manager');
      if (!coordinateur || !coordinateur.manager) {
        return res.status(404).json({ message: 'Manager not found for this coordinateur' });
      }
      managerId = coordinateur.manager.utilisateur;
    } else {
      return res.status(403).json({ message: 'Seuls les formateurs, coordinateurs et managers peuvent créer des événements' });
    }
    
    // Create the event with isValidate=false
    const nouvelEvenement = new Evenement({
      dateDebut: eventData.dateDebut,
      dateFin: eventData.dateFin,
      heureDebut: eventData.heureDebut,
      heureFin: eventData.heureFin,
      titre: eventData.titre,
      description: eventData.description,
      categorie: eventData.categorie,
      createdBy: userId,
      organisateur: userId,
      isValidate: false // Requires manager approval
    });
    
    const savedEvent = await nouvelEvenement.save();
    
    // Create notification referencing the created event
    const notification = new Notification({
      sender: userId,
      receiver: managerId,
      type: 'evenement',
      status: 'pending',
      entityId: savedEvent._id
    });
    
    await notification.save();
    console.log('Event created and notification sent:', notification);
    
    // Send real-time notification via Socket.io if available
    const io = req.app.get('io');
    if (io) {
      io.to(managerId.toString()).emit('notification', {
        _id: notification._id,
        type: notification.type,
        createdAt: notification.createdAt
      });
    }
    
    res.status(201).json({
      message: 'Événement créé et en attente d\'approbation par le manager',
      evenement: savedEvent
    });
    
  } catch (error) {
    console.error('Error in event creation:', error);
    res.status(500).json({
      message: 'Erreur lors de la création de l\'événement',
      error: error.message
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

// Compter tous les événements créés par les managers, formateurs ou coordinateurs
exports.getAllEventsByRole = async (req, res) => {
  try {
    // Récupérer tous les managers, formateurs et coordinateurs
    const managers = await Manager.find().populate('utilisateur');
    const formateurs = await Formateur.find().populate('utilisateur');
    const coordinateurs = await Coordinateur.find().populate('utilisateur');

    // Combiner tous les utilisateurs associés aux managers, formateurs et coordinateurs
    const allUsers = [
      ...managers.map(manager => manager.utilisateur),
      ...formateurs.map(formateur => formateur.utilisateur),
      ...coordinateurs.map(coordinateur => coordinateur.utilisateur)
    ].filter(user => user); // Filtrer les utilisateurs non définis

    // Extraire les IDs des utilisateurs
    const userIds = allUsers.map(user => user._id);

    // Compter les événements créés par ces utilisateurs
    const totalEvents = await Evenement.countDocuments({
      createdBy: { $in: userIds }
    });

    // Compter les événements validés et non validés
    const validatedEvents = await Evenement.countDocuments({
      createdBy: { $in: userIds },
      isValidate: true
    });

    const nonValidatedEvents = totalEvents - validatedEvents;

    // Réponse avec les résultats
    res.status(200).json({
      success: true,
      message: 'Nombre total d\'événements créés par les managers, formateurs et coordinateurs',
      totalEvents,
      validatedEvents,
      nonValidatedEvents
    });

  } catch (error) {
    console.error('Erreur lors du comptage des événements:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors du comptage des événements',
      error: error.message
    });
  }
};