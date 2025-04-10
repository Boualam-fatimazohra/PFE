const Formation = require("../Models/formation.model.js");
const mongoose=require("mongoose");
const {UtilisateurEntity} = require("../Models/utilisateurEntity.js");
const {Utilisateur} = require("../Models/utilisateur.model.js");
const Formateur = require("../Models/formateur.model.js");
const getFormateurIdsByEntities = async (entityIds) => {
  try {
    // 1. Trouver tous les utilisateurs liés aux entités spécifiées
  const utilisateursEntities = await UtilisateurEntity.find({
    id_entity: { $in: entityIds }
  });

  // De même pour le modèle Utilisateur
  const userIds = utilisateursEntities.map(ue => ue.id_utilisateur);
  const formateursUtilisateurs = await Utilisateur.find({
    _id: { $in: userIds },
    role: "Formateur"
  });
    // 4. Récupérer les IDs d'utilisateurs des formateurs
    const formateurUtilisateurIds = formateursUtilisateurs.map(formateur => formateur._id);
    
    // 5. Trouver les documents Formateur correspondant à ces utilisateurs
    const formateurs = await Formateur.find({
      utilisateur: { $in: formateurUtilisateurIds }
    });
    
    // 6. Extraire les IDs des formateurs (et non des utilisateurs)
    const formateurIds = formateurs.map(formateur => formateur._id);
    
    return formateurIds;
  } catch (error) {
    console.error("Erreur lors de la récupération des formateurs:", error);
    throw error;
  }
};
const analyserBeneficiaires = (beneficiaires) => {
    // Nombre total de bénéficiaires
    const total = beneficiaires.length;
    
    if (total === 0) {
      return {
        total: 0,
        genre: { femmes: { nombre: 0, pourcentage: 0 }, hommes: { nombre: 0, pourcentage: 0 } },
        categorieAge: "Aucune donnée",
        niveauEtudes: {
          sansBac: { nombre: 0, pourcentage: 0 },
          bac2: { nombre: 0, pourcentage: 0 },
          bac3: { nombre: 0, pourcentage: 0 },
          bac5: { nombre: 0, pourcentage: 0 }
        },
        etrangers: { nombre: 0, pourcentage: 0 },
        situationProfessionnelle: {
          etudiants: { nombre: 0, pourcentage: 0 },
          rechercheEmploi: { nombre: 0, pourcentage: 0 },
          employes: { nombre: 0, pourcentage: 0 }
        }
      };
    }
  
    // Compteurs pour le genre
    const femmes = beneficiaires.filter(b => b.genre.toLowerCase() === "femme").length;
    const hommes = beneficiaires.filter(b => b.genre.toLowerCase() === "homme").length;
    
    // Compteurs pour le niveau d'études
    const sansBac = beneficiaires.filter(b => !b.niveau || b.niveau === "bac").length;
    const bac2 = beneficiaires.filter(b => b.niveau === "bac+2").length;
    const bac3 = beneficiaires.filter(b => b.niveau === "bac+3").length;
    const bac5 = beneficiaires.filter(b => b.niveau === "bac+5").length;
    
    // Compteur pour les étrangers
    const etrangers = beneficiaires.filter(b => b.pays.toLowerCase() !== "maroc" && 
                                               (!b.nationalite || b.nationalite.toLowerCase() !== "marocain")).length;
    
    // Compteurs pour la situation professionnelle
    const etudiants = beneficiaires.filter(b => b.situationProfessionnel === "Etudiant").length;
    const sansEmploi = beneficiaires.filter(b => b.situationProfessionnel === "Sans Emploi").length;
    const employes = beneficiaires.filter(b => b.situationProfessionnel === "Employe").length;
  
    // Calcul de la catégorie d'âge moyenne
    const categoriesCount = {
      "Moin_15": 0,
      "Entre15_24": 0,
      "Entre25_34": 0, 
      "Plus_34": 0
    };
    
    beneficiaires.forEach(b => {
      if (b.categorieAge) {
        categoriesCount[b.categorieAge]++;
      } else {
        categoriesCount["Entre15_24"]++; // Valeur par défaut
      }
    });
    
    // Trouver la catégorie d'âge la plus représentée
    let categorieAgeMoyenne = "Entre15_24"; // Valeur par défaut
    let maxCount = 0;
    
    for (const [categorie, count] of Object.entries(categoriesCount)) {
      if (count > maxCount) {
        maxCount = count;
        categorieAgeMoyenne = categorie;
      }
    }
    
    // Calculer les pourcentages
    const calculerPourcentage = (nombre) => {
      return parseFloat(((nombre / total) * 100).toFixed(2));
    };
  
    // Construire et retourner l'objet résultat
    return {
      total,
      genre: {
        femmes: { 
          nombre: femmes, 
          pourcentage: calculerPourcentage(femmes)
        },
        hommes: {
          nombre: hommes,
          pourcentage: calculerPourcentage(hommes)
        }
      },
      categorieAge: categorieAgeMoyenne,
      niveauEtudes: {
        sansBac: {
          nombre: sansBac,
          pourcentage: calculerPourcentage(sansBac)
        },
        bac2: {
          nombre: bac2,
          pourcentage: calculerPourcentage(bac2)
        },
        bac3: {
          nombre: bac3,
          pourcentage: calculerPourcentage(bac3)
        },
        bac5: {
          nombre: bac5,
          pourcentage: calculerPourcentage(bac5)
        }
      },
      etrangers: {
        nombre: etrangers,
        pourcentage: calculerPourcentage(etrangers)
      },
      situationProfessionnelle: {
        etudiants: {
          nombre: etudiants,
          pourcentage: calculerPourcentage(etudiants)
        },
        rechercheEmploi: {
          nombre: sansEmploi,
          pourcentage: calculerPourcentage(sansEmploi)
        },
        employes: {
          nombre: employes,
          pourcentage: calculerPourcentage(employes)
        }
      }
    };
  };

const getFormationsTermineesByFormateurs = async (formateurIds, dateDebut, dateFin) => {
    try {
      // Valider les paramètres
      if (!Array.isArray(formateurIds) || formateurIds.length === 0) {
        throw new Error("La liste des IDs de formateurs est requise");
      }
      
      if (!(dateDebut instanceof Date) || isNaN(dateDebut.getTime())) {
        throw new Error("Une date de début valide est requise");
      }
      
      if (!(dateFin instanceof Date) || isNaN(dateFin.getTime())) {
        throw new Error("Une date de fin valide est requise");
      }
      
      if (dateDebut > dateFin) {
        throw new Error("La date de début doit être antérieure à la date de fin");
      }
      
      // Convertir les IDs de formateurs en ObjectId
      const formateursObjectIds = formateurIds.map(id => {
        try {
          return new mongoose.Types.ObjectId(id);
        } catch (err) {
          throw new Error(`ID de formateur invalide: ${id}`);
        }
      });
      
      // Récupérer les formations correspondant aux critères
      const formations = await Formation.find({
        formateur: { $in: formateursObjectIds },
        status: "Terminé",
        $and: [
          { dateDebut: { $gte: dateDebut } },
          { dateFin: { $lte: dateFin } }
        ]
      });
      
      return formations;
    } catch (error) {
      console.error("Erreur lors de la récupération des formations:", error);
      throw error;
    }
  };

module.exports = { analyserBeneficiaires ,getFormationsTermineesByFormateurs,getFormateurIdsByEntities};