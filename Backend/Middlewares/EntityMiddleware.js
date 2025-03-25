const mongoose = require('mongoose');
const { Entity } = require('../Models/entity.model');
const EDC = require('../Models/edc.model');
const OFab = require('../Models/ofab.model');
const Fab = require('../Models/fab.model');

const { UtilisateurEntity } = require('../Models/utilisateurEntity');

/**
 * Middleware qui vérifie si l'utilisateur authentifié appartient à une entité spécifique
 * @param {string} entityType - Type d'entité à vérifier ("EDC", "OFab", "Fab")
 * @returns {Function} Middleware Express
 */
const checkEntityAccess = (entityType) => {
    return async (req, res, next) => {
      try {
        if (!req.user?.userId) {
          return res.status(401).json({ message: "Non authentifié" });
        }
  
        const userId = req.user.userId;
        console.log(`Vérification accès pour ${userId} à ${entityType}`);
  
        // Méthode alternative plus fiable
        const entities = await Entity.aggregate([
          {
            $lookup: {
              from: "utilisateurentities",
              localField: "_id",
              foreignField: "id_entity",
              as: "associations"
            }
          },
          {
            $match: {
              "associations.id_utilisateur": new mongoose.Types.ObjectId(userId),
              "type": entityType
            }
          }
        ]);
  
        if (entities.length === 0) {
          console.log('Aucune entité correspondante trouvée');
          return res.status(403).json({ message: "Accès refusé" });
        }
  
        req.entity = entities[0];
        next();
      } catch (error) {
        console.error("Erreur middleware:", error);
        res.status(500).json({ message: "Erreur serveur" });
      }
    };
  };
  
  module.exports = { checkEntityAccess };