const Evaluation = require("../Models/evaluation.model.js");
const  BeneficiareFormation=require("../Models/beneficiairesFormation.js");
const {sendEvaluationLinkWithToken}=require("../utils/sendEvaluationLinkWithToken.js");
const Beneficiaire=require("../Models/beneficiaire.model");
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
module.exports = {
    getLastEvaluation,
    sendEvaluationLinksToBeneficiaries,
    SubmitEvaluation
  };
