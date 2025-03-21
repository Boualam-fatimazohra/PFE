const Presence = require('../Models/presence.model.js');
const BeneficiaireFormation = require('../Models/beneficiairesFormation.js');

// POST /api/presences
const MarquerPresence = async (req, res) => {
  try {
    const { presences, jour, periode } = req.body;
    
    // Validation des données reçues
    if (!presences || !Array.isArray(presences) || !jour || !periode) {
      return res.status(400).json({ 
        success: false, 
        message: 'Données invalides. Veuillez fournir un tableau de présences, une date et une période.' 
      });
    }
    
    // Vérification que la période est valide (Matin ou apresMidi)
    if (periode !== 'Matin' && periode !== 'apresMidi') {
      return res.status(400).json({ 
        success: false, 
        message: 'La période doit être "Matin" ou "apresMidi".' 
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

    // Traiter chaque présence
    const presenceResults = [];
    for (const presence of presences) {
      const { beneficiareFormationId, isPresent } = presence;
      
      // Vérifier si le bénéficiaire existe dans cette formation
      const beneficiareFormation = await BeneficiaireFormation.findById(beneficiareFormationId);
      if (!beneficiareFormation) {
        presenceResults.push({
          beneficiareFormationId,
          success: false,
          message: 'Identifiant de bénéficiaire-formation invalide.'
        });
        continue;
      }

      // Vérifier si une présence existe déjà pour ce bénéficiaire à cette date et période
      let presenceRecord = await Presence.findOne({
        beneficiareFormation: beneficiareFormationId,
        jour: {
          $gte: new Date(jourDate.setHours(0, 0, 0, 0)),
          $lt: new Date(jourDate.setHours(23, 59, 59, 999))
        },
        periode
      });

      // Si la présence existe, mettre à jour, sinon créer
      if (presenceRecord) {
        presenceRecord.isPresent = isPresent;
        await presenceRecord.save();
        presenceResults.push({
          beneficiareFormationId,
          success: true,
          message: 'Présence mise à jour avec succès.',
          presenceId: presenceRecord._id
        });
      } else {
        const newPresence = new Presence({
          beneficiareFormation: beneficiareFormationId,
          jour: jourDate,
          periode,
          isPresent
        });
        
        const savedPresence = await newPresence.save();
        presenceResults.push({
          beneficiareFormationId,
          success: true,
          message: 'Présence enregistrée avec succès.',
          presenceId: savedPresence._id
        });
      }
    }

    return res.status(200).json({
      success: true,
      message: 'Traitement des présences terminé.',
      results: presenceResults
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