const Evaluation = require("../Models/evaluation.model");
const  BeneficiareFormation=require("../Models/beneficiairesFormation.js");
const {sendEvaluationLinkWithToken}=require("../utils/sendEvaluationLinkWithToken.js");
const Beneficiaire=require("../Models/beneficiaire.model");
const Formateur  = require('../Models/formateur.model.js');

const mongoose = require('mongoose');
// debut fct : enregistrer la réponse du beneficiare
const SubmitEvaluation = async (req, res) => {
  const { token } = req.params;
  try {
    if (!token) {
      return res.status(400).json({ message: "Token manquant"});
    }
    const beneficiaireFormation = await BeneficiareFormation.findOne({ token });
    beneficiaireFormation.isSubmited = true;
    await beneficiaireFormation.save();
    const {
      formationTitle,
      endDate,          // Ajoutez cette ligne
      participants,     // Ajoutez cette ligne
      qualiteContenuFormation,
      utiliteCompetencesAcquises,
      alignementBesoinsProf,
      structureFormation,
      niveauDifficulte,
      qualitePedagogique,
      expertiseFormateur,
      qualiteSupportFormation,
      qualiteExercices,
      adaptationNiveauParticipants,
      confortSalle,
      accessibiliteLieu,
      horaires,
      materielPedagogique,
      communicationOrganisationnelle,
      recommandation,
      commentaire,
      formation
    } = req.body;

    const newEvaluation = new Evaluation({
      dateFin: endDate,
      nombreParticipants: participants,
      formationTitle,
      contentEvaluation: {
        qualiteContenuFormation,
        utiliteCompetencesAcquises,
        alignementBesoinsProf,
        structureFormation,
        niveauDifficulte
      },
      pedagogy: {
        qualitePedagogique,
        expertiseFormateur,
        qualiteSupportFormation,
        qualiteExercices,
        adaptationNiveauParticipants
      },
      materialConditions: {
        confortSalle,
        accessibiliteLieu,
        horaires,
        materielPedagogique
      },
      generalOrganization: {
        communicationOrganisationnelle
      },
      recommandation,
      commentaire,
      formation
    });

    await newEvaluation.save();

    res.status(201).json({ message: 'Évaluation soumise avec succès', evaluation: newEvaluation });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la soumission de l\'évaluation', error: error.message });
  }
};

// fin fct : enregistrer la réponse du beneficiare
// Dans evaluation.controller.js
const createEvaluation = async (req, res) => {
  try {
    // Récupérer l'ID de l'utilisateur depuis l'authentification
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ message: "Utilisateur non authentifié" });
    }

    // Extraire les données de la requête
    const {
      title,
      formationId,
      startDate,
      endDate,
      dateFin,
      participants,
      nombreParticipants,
      anonymousResponses,
      responseDeadline,
      responseDeadlineDate,
      beneficiaryIds
    } = req.body;

    // Vérifier les champs obligatoires
    if (!title || !formationId) {
      return res.status(400).json({ message: "Le titre et l'ID de la formation sont requis" });
    }

    // Trouver le formateur associé à cet utilisateur
    const formateur = await Formateur.findOne({ utilisateur: userId });
    if (!formateur) {
      return res.status(404).json({ message: "Formateur non trouvé" });
    }

    // Créer la nouvelle évaluation
    const newEvaluation = new Evaluation({
      formationTitle: title,
      formation: formationId,
      dateDebut: startDate,
      dateFin: dateFin || endDate,
      formateur: formateur._id,
      nombreParticipants: nombreParticipants || participants || 0,
      parametres: {
        anonymousResponses: anonymousResponses || false,
        responseDeadline: responseDeadline || false,
        responseDeadlineDate: responseDeadlineDate || null
      },
      statut: "Créée",
      dateCreation: new Date()
    });

    // Sauvegarder l'évaluation
    const savedEvaluation = await newEvaluation.save();

    // Si des bénéficiaires sont spécifiés, mettre à jour leurs documents
    if (beneficiaryIds && beneficiaryIds.length > 0) {
      await BeneficiareFormation.updateMany(
        { 
          beneficiaire: { $in: beneficiaryIds },
          formation: formationId
        },
        { 
          $set: { 
            isSelected: true,
            evaluation: savedEvaluation._id
          }
        }
      );
    }

    res.status(201).json({ 
      message: "Évaluation créée avec succès", 
      evaluation: savedEvaluation 
    });
    
  } catch (error) {
    console.error("Erreur lors de la création de l'évaluation:", error);
    res.status(500).json({ 
      message: "Erreur lors de la création de l'évaluation", 
      error: error.message 
    });
  }
};
// debut fct: envoyer les liens d'evaluation aux beneficiares

const sendEvaluationLinksToBeneficiaries = async (req, res) => {
  try {
    const { beneficiaryIds, formationId } = req.body;
    if (!beneficiaryIds || beneficiaryIds.length === 0) {
      return res.status(400).json({ message: "Aucun ID de bénéficiaire fourni." });
    }
    if (!formationId) {
      return res.status(400).json({ message: "L'ID de la formation est requis." });
    }
    // Récupérer les bénéficiaires dans la base de données
    const beneficiaries = await Beneficiaire.find({ _id: { $in: beneficiaryIds } });

    if (beneficiaries.length === 0) {
      return res.status(404).json({ message: "Aucun bénéficiaire trouvé avec les IDs fournis." });
    }
    // Tableau pour stocker les promesses
    const updatePromises = beneficiaries.map(async (beneficiary) => {
      const email = beneficiary.email;
      const beneficiaryId = beneficiary._id;

      if (!email) {
        console.warn(`Aucun email trouvé pour le bénéficiaire ${beneficiaryId}`);
        return null;
      }

      try {
        // Générer un token et envoyer l'email
        const token = await sendEvaluationLinkWithToken(email, formationId);
        console.log(`Lien envoyé à ${email} avec le token : ${token}`);
        const beneficiaireFormation = await BeneficiareFormation.findOneAndUpdate(
            { 
              formation: new mongoose.Types.ObjectId(formationId), 
              beneficiaire: new mongoose.Types.ObjectId(beneficiaryId) 
            },
            { $set: { token } }, 
            { new: true, useFindAndModify: false }
          );

        if (!beneficiaireFormation) {
          console.warn(`Aucune instance de BeneficiareFormation trouvée pour le bénéficiaire ${beneficiaryId} et la formation ${formationId}`);
        } else {
          console.log(`Token stocké pour le bénéficiaire ${beneficiaryId}et la formation ${formationId}`);
        }
      } catch (error) {
        console.error(`Erreur lors de l'envoi du lien à ${email}:`, error.message);
      }
    });
    // Attendre que toutes les opérations soient terminées
    await Promise.all(updatePromises);
    return res.status(200).json({ message: "Les liens d'évaluation ont été envoyés." });
  } catch (error) {
    console.error("Erreur lors de l'envoi des liens d'évaluation :", error);
    return res.status(500).json({ message: "Erreur interne du serveur." });
  }
};
// fin fct: envoyer les liens d'evaluation aux beneficiares

const getLastEvaluation = async (req, res) => {
    console.log("debut de la fonction getLastEvaluation");
    try { 
    const evaluation = await Evaluation.findOne();
    console.log("evaluation ::: ", evaluation); // Affiche l'évaluation dans la console
    if (!evaluation) {
        console.log("Aucune évaluation trouvée.");
        return res.status(404).json({ error: "Évaluation non trouvée" });
      }
    res.status(200).json(evaluation);
    } catch (error) {
      console.log("Erreur:", error);
      res.status(500).json({ error: "Erreur lors de la récupération de l'évaluation" });
    }
  };  
// Get all evaluations
const getAllEvaluations = async (req, res) => {
  try {
    const evaluations = await Evaluation.find()
      .sort({ dateCreation: -1 });
    
    res.status(200).json(evaluations);
  } catch (error) {
    console.error("Erreur lors de la récupération des évaluations:", error);
    res.status(500).json({ 
      message: "Erreur lors de la récupération des évaluations", 
      error: error.message 
    });
  }
};
const deleteEvaluation = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Vérifier si l'ID est valide
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID d'évaluation invalide" });
    }

    // Supprimer l'évaluation
    const deletedEvaluation = await Evaluation.findByIdAndDelete(id);

    if (!deletedEvaluation) {
      return res.status(404).json({ message: "Évaluation non trouvée" });
    }

    // Mettre à jour les BeneficiareFormation associés
    await BeneficiareFormation.updateMany(
      { evaluation: id },
      { 
        $unset: { evaluation: "" },
        $set: { isSelected: false, token: null, isSubmited: false }
      }
    );

    res.status(200).json({ message: "Évaluation supprimée avec succès" });
  } catch (error) {
    console.error("Erreur lors de la suppression de l'évaluation:", error);
    res.status(500).json({ 
      message: "Erreur lors de la suppression de l'évaluation", 
      error: error.message 
    });
  }
};

const getEvaluationFormateur = async (req, res) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ message: "Utilisateur non authentifié" });
    }

    const formateur = await Formateur.findOne({ utilisateur: userId });
    if (!formateur) {
      return res.status(404).json({ message: "Formateur non trouvé" });
    }

    // Utiliser populate pour obtenir les informations associées
    const Evaluations = await Evaluation.find({ formateur: formateur._id })
      .populate('formation')  // Obtenir les détails de la formation
      .populate({
        path: 'formation',
        // Si vous avez besoin de gérer les bénéficiaires via formation
        populate: {
          path: 'beneficiaires',
          model: 'BeneficiareFormation'
        }
      });

    res.status(200).json(Evaluations);
  } catch (error) {
    res.status(500).json({ 
      message: "Erreur lors de la récupération des évaluations",
      error: error.message 
    });
  }
};

// N'oubliez pas d'ajouter ces fonctions à vos exports

module.exports = {
    getLastEvaluation,
    sendEvaluationLinksToBeneficiaries,
    SubmitEvaluation,
    getAllEvaluations,
    getEvaluationFormateur,
    deleteEvaluation,
    createEvaluation
    
  };