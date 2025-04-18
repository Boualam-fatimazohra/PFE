const Presence = require('../Models/presence.model.js');
const BeneficiaireFormation = require('../Models/beneficiairesFormation.js');
const Formation = require('../Models/formation.model.js');

// POST /api/presences
const MarquerPresence = async (req, res) => {
  try {
    console.log("=========DEBUG PRESENCE CONTROLLER=========");
    console.log('req.body:', JSON.stringify(req.body));
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
    
    // Convertir la date si elle est reçue sous forme de string et la formater en YYYY-MM-DD
    try {
      const jourDate = new Date(jour);
      if (isNaN(jourDate.getTime())) {
        return res.status(400).json({
          success: false,
          message: 'Format de date invalide.'
        });
      }
      
      // Formater la date en YYYY-MM-DD pour éliminer les problèmes de fuseau horaire
      const jourFormatted = jourDate.toISOString().split('T')[0];
      console.log("Date formatée pour la recherche:", jourFormatted);
      
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
      
      // Récupérer tous les enregistrements de présence existants pour ce jour et ces bénéficiaires
      // en utilisant la date formatée pour une comparaison directe ou via $dateToString
      const existingPresences = await Presence.find({
        beneficiareFormation: { $in: beneficiaryIds },
        $expr: {
          $eq: [
            { $dateToString: { format: "%Y-%m-%d", date: "$jour" } },
            jourFormatted
          ]
        }
      });
      
      console.log(`Trouvé ${existingPresences.length} enregistrements de présence existants pour la date ${jourFormatted}`);
      
      if (existingPresences.length > 0) {
        console.log("Premier enregistrement trouvé:", JSON.stringify(existingPresences[0]));
      } else {
        console.log("Aucun enregistrement trouvé pour cette date");
      }
      
      // Créer un map des présences existantes pour faciliter la recherche
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
          console.log(`Mise à jour de la présence existante pour ${beneficiareFormationId}, isPresent: ${isPresent}`);
        } else {
          // Créer une nouvelle présence en utilisant la date formatée
          bulkOperations.push({
            insertOne: {
              document: {
                beneficiareFormation: beneficiareFormationId,
                jour: new Date(jourFormatted), // Créer une nouvelle date à partir de la chaîne formatée
                isPresent: isPresent
              }
            }
          });
          console.log(`Création d'une nouvelle présence pour ${beneficiareFormationId}, isPresent: ${isPresent}`);
        }
      }
      
      console.log(`${bulkOperations.length} opérations préparées:`, 
        bulkOperations.map(op => op.updateOne ? 'update' : 'insert').join(', '));
      
      // Exécuter toutes les opérations en une seule requête
      const result = await Presence.bulkWrite(bulkOperations);
      console.log("Résultat de l'opération bulkWrite:", JSON.stringify(result));
      
      // Si le bulkWrite a été exécuté, effectuer une vérification post-opération
      if (bulkOperations.length > 0) {
        const updatedPresences = await Presence.find({
          beneficiareFormation: { $in: beneficiaryIds },
          $expr: {
            $eq: [
              { $dateToString: { format: "%Y-%m-%d", date: "$jour" } },
              jourFormatted
            ]
          }
        });
        
        console.log(`Après bulkWrite: ${updatedPresences.length} enregistrements trouvés`);
        updatedPresences.forEach(p => {
          console.log(`Présence post-update - ID: ${p._id}, isPresent: ${p.isPresent}`);
        });
      }
      
      return res.status(200).json({
        success: true,
        message: 'Présences mises à jour avec succès.',
        stats: {
          modified: result.modifiedCount || 0,
          inserted: result.insertedCount || 0,
          total: presences.length
        }
      });
      
    } catch (dateError) {
      console.error('Erreur de traitement de date:', dateError);
      return res.status(400).json({
        success: false,
        message: 'Format de date invalide ou erreur de traitement.',
        error: dateError.message
      });
    }
    
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