const Achat = require('../Models/Achat.model.js');
const Coordinateur = require('../Models/coordinateur.model.js');
const Formation = require('../Models/formation.model.js');
const Evenement = require('../Models/evenement.model.js');
const { Entity } = require('../Models/entity.model.js');
const createAchat = async (req, res) => {
  console.log("Create Achat");
  try {
    //  Get user ID from authentication
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ message: "Utilisateur non authentifié" });
    }

    //  Find the coordinateur associated with this user
    const coordinateur = await Coordinateur.findOne({ utilisateur: userId });
    if (!coordinateur) {
      return res.status(401).json({ message: "Coordinateur non trouvé" });
    }

    //  Extract data from request body
    const {
      etatDemandeAchat,
      etatBonCommande,
      etatPrestation,
      etatPVR,
      etatPaiement,
      affectation,
      associationType,
      associationId,
      datePrevuePaiement
    } = req.body;

    //  Validate required fields
    if (!etatDemandeAchat || !etatBonCommande || !associationType || !associationId) {
      return res.status(400).json({
        message: "Les champs etatDemandeAchat, etatBonCommande, associationType et associationId sont obligatoires"
      });
    }

    //  Vérifier que l'objet associé existe bien
    let Model;
    switch (associationType) {
      case 'Formation':
        Model = Formation;
        break;
      case 'Evenement':
        Model = Evenement;
        break;
      case 'Entity':
        Model = Entity;
        break;
      default:
        return res.status(400).json({ message: "Type d'association invalide" });
    }

    // Vérifier l'existence de l'objet associé
    const associatedObject = await Model.findById(associationId);
    if (!associatedObject) {
      return res.status(404).json({ 
        message: `${associationType} avec l'ID spécifié n'existe pas` 
      });
    }

    //  Créer le nouvel achat
    const nouvelAchat = new Achat({
      idCoordinateur: coordinateur._id,
      etatDemandeAchat,
      etatBonCommande,
      dateCreation: new Date(),
      etatPrestation: etatPrestation || "teste",
      etatPVR: etatPVR || "test",
      datePrevuePaiement: datePrevuePaiement || new Date(),
      etatPaiement: etatPaiement || "test",
      affectation: affectation || "test",
      associationType,
      associationId
    });

    //  Sauvegarder l'achat
    const achatEnregistre = await nouvelAchat.save();
    res.status(201).json({
      message: "Achat créé avec succès",
      achat: achatEnregistre
    });
  } catch (error) {
    console.error("Erreur création achat:", error);
    res.status(500).json({
      message: "Erreur lors de la création de l'achat",
      error: error.message
    });
  }
};
// recupérer tout les achats du coordinateur connecté
const getAllAchats = async (req, res) => {
  try {
    const userId = req.user.userId;     // D'abord, trouver le coordinateur associé à cet utilisateur
    const coordinateur = await Coordinateur.findOne({ utilisateur: userId });
    
     if (!coordinateur) {
       return res.status(404).json({ message: "Coordinateur non trouvé" });
     }
    // Filtrer les achats par l'ID du coordinateur connecté
    const achats = await Achat.find({ idCoordinateur: coordinateur._id })
      .populate('idCoordinateur')
      .sort({ dateCreation: -1 });
      
    res.status(200).json({
      message: "Liste des achats récupérée avec succès",
      achats: achats
    });
  } catch (error) {
    console.error("Erreur récupération achats:", error);
    res.status(500).json({
      message: "Erreur lors de la récupération des achats",
      error: error.message
    });
  }
};
// recupérer un achat par son id
const getAchatById = async (req, res) => {
  try {
    const achat = await Achat.findById(req.params.id)
      .populate('idCoordinateur');
    
    if (!achat) {
      return res.status(404).json({ message: "Achat non trouvé" });
    }

    // Récupérer l'objet associé (Formation, Evenement ou Entity)
    const associatedObject = await achat.getAssociation();
    
    res.status(200).json({
      message: "Achat récupéré avec succès",
      achat: {
        ...achat.toObject(),
        associatedObject
      }
    });
  } catch (error) {
    console.error("Erreur récupération achat:", error);
    res.status(500).json({
      message: "Erreur lors de la récupération de l'achat",
      error: error.message
    });
  }
};


// const updateAchat = async (req, res) => {
//   try {
   
//     // Vérifier que l'achat existe
//     const achat = await Achat.findById(req.params.id);
//     if (!achat) {
//       return res.status(404).json({ message: "Achat non trouvé" });
//     }
//     // Extract data from request body
//     const {
//       etatDemandeAchat,
//       etatBonCommande,
//       etatPrestation,
//       etatPVR,
//       etatPaiement,
//       affectation,
//       associationType,
//       associationId,
//       datePrevuePaiement
//     } = req.body;

//     // Si associationType ou associationId change, vérifier la cohérence
//     if (associationType && associationType !== achat.associationType || 
//         associationId && associationId.toString() !== achat.associationId.toString()) {
      
//     // Déterminer le type à vérifier
//       const typeToCheck = associationType || achat.associationType;
//       const idToCheck = associationId || achat.associationId;
      
//       let Model;
//       switch (typeToCheck) {
//         case 'Formation':
//           Model = Formation;
//           break;
//         case 'Evenement':
//           Model = Evenement;
//           break;
//         case 'Entity':
//           Model = Entity;
//           break;
//         default:
//           return res.status(400).json({ message: "Type d'association invalide" });
//       }

//       // Vérifier l'existence de l'objet associé
//       const associatedObject = await Model.findById(idToCheck);
//       if (!associatedObject) {
//         return res.status(404).json({ 
//           message: `${typeToCheck} avec l'ID spécifié n'existe pas` 
//         });
//       }
//     }

//     // 5. Mettre à jour l'achat
//     const achatMisAJour = await Achat.findByIdAndUpdate(
//       req.params.id,
//       {
//         etatDemandeAchat: etatDemandeAchat || achat.etatDemandeAchat,
//         etatBonCommande: etatBonCommande || achat.etatBonCommande,
//         etatPrestation: etatPrestation || achat.etatPrestation,
//         etatPVR: etatPVR || achat.etatPVR,
//         etatPaiement: etatPaiement || achat.etatPaiement,
//         affectation: affectation || achat.affectation,
//         associationType: associationType || achat.associationType,
//         associationId: associationId || achat.associationId,
//         datePrevuePaiement: datePrevuePaiement || achat.datePrevuePaiement
//       },
//       { new: true, runValidators: true }
//     );
//     res.status(200).json({
//       message: "Achat mis à jour avec succès",
//       achat: achatMisAJour
//     });
//   } catch (error) {
//     console.error("Erreur mise à jour achat:", error);
//     res.status(500).json({
//       message: "Erreur lors de la mise à jour de l'achat",
//       error: error.message
//     });
//   }
// };

const deleteAchat = async (req, res) => {
  try {
    // Vérifier que l'achat existe avant de le supprimer
    const achat = await Achat.findById(req.params.id);
    if (!achat) {
      return res.status(404).json({ message: "Achat non trouvé" });
    }

    //  Supprimer l'achat
    await Achat.findByIdAndDelete(req.params.id);
    res.status(200).json({
      message: "Achat supprimé avec succès"
    });
  } catch (error) {
    console.error("Erreur suppression achat:", error);
    res.status(500).json({
      message: "Erreur lors de la suppression de l'achat",
      error: error.message
    });
  }
};

const getAchatsByType = async (req, res) => {
  try {
    const { associationType } = req.params;
    
    // Vérifier que le type est valide
    if (!['Formation', 'Evenement', 'Entity'].includes(associationType)) {
      return res.status(400).json({ message: "Type d'association invalide" });
    }
    
    const achats = await Achat.find({ associationType })
      .populate('idCoordinateur')
      .sort({ dateCreation: -1 });
    
    res.status(200).json({
      message: `Achats de type ${associationType} récupérés avec succès`,
      achats: achats
    });
  } catch (error) {
    console.error("Erreur récupération achats par type:", error);
    res.status(500).json({
      message: "Erreur lors de la récupération des achats",
      error: error.message
    });
  }
};


const getAchatsByAssociation = async (req, res) => {
  try {
    const { associationType } = req.params;
    
    // Vérifier que le type est valide
    if (!['Formation', 'Evenement', 'Entity'].includes(associationType)) {
      return res.status(400).json({ message: "Type d'association invalide" });
    }
    
    const achats = await Achat.find({ 
      associationType
      
    })
    .populate('idCoordinateur')
    .sort({ dateCreation: -1 });
    
    res.status(200).json({
      message: `Achats associés à ${associationType}  récupérés avec succès`,
      achats: achats
    });
  } catch (error) {
    console.error("Erreur récupération achats par association:", error);
    res.status(500).json({
      message: "Erreur lors de la récupération des achats",
      error: error.message
    });
  }
};


module.exports = {
  createAchat,
  getAllAchats,
  getAchatById,
  deleteAchat,
  getAchatsByType,
  getAchatsByAssociation,
};