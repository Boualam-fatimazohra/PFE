const Evaluation = require("../Models/evaluation.model.js");
const  BeneficiareFormation=require("../Models/BeneficiareFormation.model.js");
const sendEvaluationLinkWithToken=require("../utils/sendEvaluationLinkWithToken.js");
const Beneficiaire=require("../Models/beneficiaire.model");
const SubmitEvaluation = async (req, res) => {
  const { token } = req.params;
  try {
    if (!token) {
      return res.status(400).json({ message: "Token manquant" });
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
      commentaire
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
      commentaire
    });

    await newEvaluation.save();

    res.status(201).json({ message: 'Évaluation soumise avec succès', evaluation: newEvaluation });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la soumission de l\'évaluation', error: error.message });
  }
};

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

        // Trouver et mettre à jour l'instance BeneficiareFormation
        const beneficiaireFormation = await BeneficiareFormation.findOneAndUpdate(
          { formation: formationId, beneficiaires: beneficiaryId },
          { $set: { token } },
          { new: true }
        );

        if (!beneficiaireFormation) {
          console.warn(`Aucune instance de BeneficiareFormation trouvée pour le bénéficiaire ${beneficiaryId} et la formation ${formationId}`);
        } else {
          console.log(`Token stocké pour le bénéficiaire ${beneficiaryId}`);
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
//   exports.importEvaluationsFromExcel = async (filePath) => {
//     try {
//         const data = readExcelFile(filePath); 

//         const evaluations = data.map((row) => ({
//             formationTitle: row["Titre Formation"] || "Développement C# Fundamentals et Applications Modernes",
//             formationDate: row["Date Formation"] || "12, 13 & 14 Février 2025",
//             contentEvaluation: {
//                 qualiteContenuFormation: row["Qualité Contenu Formation"] || 3,
//                 utiliteCompetencesAcquises: row["Utilité Compétences Acquises"] || 3,
//                 alignementBesoinsProf: row["Alignement Besoins Pro"] || 3,
//                 structureFormation: row["Structure Formation"] || 3,
//                 niveauDifficulte: row["Niveau Difficulté"] || 3
//             },
//             pedagogy: {
//                 qualitePedagogique: row["Qualité Pédagogique"] || 3,
//                 expertiseFormateur: row["Expertise Formateur"] || 3,
//                 qualiteSupportFormation: row["Qualité Support Formation"] || 3,
//                 qualiteExercices: row["Qualité Exercices"] || 3,
//                 adaptationNiveauParticipants: row["Adaptation Niveau Participants"] || 3
//             },
//             materialConditions: {
//                 confortSalle: row["Confort Salle"] || 3,
//                 accessibiliteLieu: row["Accessibilité Lieu"] || 3,
//                 horaires: row["Horaires"] || 3,
//                 materielPedagogique: row["Matériel Pédagogique"] || 3
//             },
//             generalOrganization: {
//                 communicationOrganisationnelle: row["Communication Organisationnelle"] || 3
//             },
//             recommandation: row["Recommandation"] === "Oui" ? true : false,
//             commentaire: row["Commentaire"] || ""
//         }));

//         await Evaluation.insertMany(evaluations);
//         console.log("Importation terminée avec succès !");
//     } catch (error) {
//         console.error("Erreur lors de l'importation des évaluations :", error);
//     }
// };
  
module.exports = {
    getLastEvaluation,
    sendEvaluationLinksToBeneficiaries,
    SubmitEvaluation
  };
  

  
