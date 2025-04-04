const Presence = require('../Models/presence.model.js');
const BeneficiaireFormation = require('../Models/beneficiairesFormation.js');
const Formation = require('../Models/formation.model.js');

// POST /api/presences
const MarquerPresence = async (req, res) => {
  try {
    const { presences, jour, formationId } = req.body;
    
    // Validation des données reçues
    if (!presences || !Array.isArray(presences) || !jour || !formationId) {
      return res.status(400).json({
        success: false,
        message: 'Données invalides. Veuillez fournir un tableau de présences, une date et l\'ID de la formation.'
      });
    }
    
    // Vérifier que la formation existe
    const formation = await Formation.findById(formationId);
    if (!formation) {
      return res.status(404).json({
        success: false,
        message: 'Formation non trouvée.'
      });
    }
    
    // Convertir la date si elle est reçue sous forme de string
    const jourDate = new Date(jour);
    if (isNaN(jourDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: 'Format de date invalide.'
      });
    }
    
    // Extraire tous les IDs des bénéficiaires
    const beneficiaryIds = presences.map(p => p.beneficiareFormationId);
    
    // Vérifier que tous les bénéficiaires existent et sont inscrits à cette formation
    const beneficiaries = await BeneficiaireFormation.find({
      _id: { $in: beneficiaryIds },
      formation: formationId
    });
    
    if (beneficiaries.length !== beneficiaryIds.length) {
      return res.status(400).json({
        success: false,
        message: 'Un ou plusieurs bénéficiaires sont invalides ou ne sont pas inscrits à cette formation.'
      });
    }
    
    // Créer une plage de temps pour le jour spécifié (de minuit à 23:59:59)
    const jourDebut = new Date(jourDate);
    jourDebut.setHours(0, 0, 0, 0);
    const jourFin = new Date(jourDate);
    jourFin.setHours(23, 59, 59, 999);
    
    // Récupérer tous les enregistrements de présence existants pour ce jour et ces bénéficiaires
    const existingPresences = await Presence.find({
      beneficiareFormation: { $in: beneficiaryIds },
      jour: {
        $gte: jourDebut,
        $lte: jourFin
      }
    });
    
    // Créer un map des présences existantes pour faciliter la recherche --> [beneFormationId] == presence->[benfForm, isPresent]
    const presenceMap = {};
    existingPresences.forEach(presence => {
      presenceMap[presence.beneficiareFormation.toString()] = presence;
    });
    
    // Préparer les opérations d'écriture en masse
    const bulkOperations = [];
    
    // Traiter chaque présence
    for (const presence of presences) {
      const { beneficiareFormationId, isPresent } = presence;
      const existingPresence = presenceMap[beneficiareFormationId];
      
      if (existingPresence) {
        // Mettre à jour une présence existante
        bulkOperations.push({
          updateOne: {
            filter: { _id: existingPresence._id },
            update: { $set: { isPresent: isPresent } }
          }
        });
      } else {
        // Créer une nouvelle présence
        bulkOperations.push({
          insertOne: {
            document: {
              beneficiareFormation: beneficiareFormationId,
              jour: jourDate,
              isPresent: isPresent
            }
          }
        });
      }
    }
    
    // Exécuter toutes les opérations en une seule requête
    const result = await Presence.bulkWrite(bulkOperations);
    
    return res.status(200).json({
      success: true,
      message: 'Présences mises à jour avec succès.',
      stats: {
        modified: result.modifiedCount || 0,
        inserted: result.insertedCount || 0,
        total: presences.length
      }
    });
    
  } catch (error) {
    console.error('Erreur lors du marquage des présences:', error);
    return res.status(500).json({
      success: false,
      message: 'Erreur lors du traitement de la demande.',
      error: error.message
    });
  }
};

module.exports = { MarquerPresence };