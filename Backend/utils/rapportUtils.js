const Formation = require("../Models/formation.model.js");
const mongoose=require("mongoose");
const {UtilisateurEntity} = require("../Models/utilisateurEntity.js");
const {Utilisateur} = require("../Models/utilisateur.model.js");
const Formateur = require("../Models/formateur.model.js");
const {getBeneficiairesByFormation} = require("../utils/BeneficiairePresence.js");
const Excel = require("exceljs");
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
const genererRapportData = async (entityIds, dateDebut, dateFin) => {
    try {
      // Validation des entrées
      if (!dateDebut || !dateFin || !entityIds) {
        return {
          success: false,
          message: "Les dates de début et fin, ainsi que les IDs des entités sont obligatoires"
        };
      }
      // Récupération des IDs de formateurs à partir des IDs d'entités
      const formateurIds = await getFormateurIdsByEntities(entityIds);
      
      if (formateurIds.length === 0) {
        return {
          success: true,
          message: "Aucun formateur trouvé pour les entités spécifiées",
          data: []
        };
      }
      
      // Conversion des dates
      const dateDebutObj = new Date(dateDebut);
      const dateFinObj = new Date(dateFin);
      
      // Récupération des formations
      const formations = await getFormationsTermineesByFormateurs(formateurIds, dateDebutObj, dateFinObj);
      
      if (formations.length === 0) {
        return {
          success: true,
          message: "Aucune formation trouvée pour la période et les formateurs spécifiés",
          data: []
        };
      }
      
      // Construction du rapport
      const rapportComplet = [];
      
      for (const formation of formations) {
        // Récupération des bénéficiaires pour cette formation
        const beneficiaireResults = await getBeneficiairesByFormation(formation._id);
        
        // Extraction des documents de bénéficiaires
        const beneficiaires = beneficiaireResults.map(result => result.beneficiaire);
        
        // Analyse des bénéficiaires
        const statistiques = analyserBeneficiaires(beneficiaires);
        
        // Détermination de l'année de la formation
        const anneeFormation = formation.dateDebut.getFullYear();
        
        // Construction de l'objet rapport pour cette formation
        rapportComplet.push({
          annee: anneeFormation,
          periode: {
            dateDebut: formation.dateDebut,
            dateFin: formation.dateFin
          },
          // formationId: formation._id,
          nomFormation: formation.nom,
          formateur: formation.formateur, // Si vous avez fait le populate, sinon ce sera juste l'ID
          statistiques: statistiques
        });
      }
      
      // Tri des formations par année (du plus récent au plus ancien)
      rapportComplet.sort((a, b) => b.annee - a.annee);
      
      return {
        success: true,
        count: rapportComplet.length,
        data: rapportComplet
      };
      
    } catch (error) {
      console.error("Erreur lors de la génération des données du rapport:", error);
      return {
        success: false,
        message: "Erreur lors de la génération des données du rapport",
        error: error.message
      };
    }
  };

const convertirRapportEnExcel = async (data) => {
    const workbook = new Excel.Workbook();
    const worksheet = workbook.addWorksheet("Rapport");
    
    // Merge les cellules pour les en-têtes principaux qui couvrent deux sous-colonnes
    worksheet.mergeCells('A1:A3'); // Année
    worksheet.mergeCells('B1:B3'); // Date
    worksheet.mergeCells('C1:C3'); // Formation
    worksheet.mergeCells('D1:D3'); // Total bénéficiaires
    worksheet.mergeCells('E1:F1'); // Femme (titre principal)
    worksheet.mergeCells('G1:H1'); // Homme (titre principal)
    worksheet.mergeCells('I1:I3'); // Age moyen
    worksheet.mergeCells('J1:K1'); // Sans Bac (titre principal)
    worksheet.mergeCells('L1:M1'); // Bac (titre principal)
    worksheet.mergeCells('N1:O1'); // Bac+2 (titre principal)
    worksheet.mergeCells('P1:Q1'); // Bac+3 (titre principal)
    worksheet.mergeCells('R1:S1'); // Bac+5 (titre principal)
    worksheet.mergeCells('T1:U1'); // Étrangers (titre principal)
    worksheet.mergeCells('V1:W1'); // En formation (titre principal)
    worksheet.mergeCells('X1:Y1'); // recherche d'emp (titre principal)
    worksheet.mergeCells('Z1:AA1'); // Employé (titre principal)
    
    // Ajouter les en-têtes principaux
    worksheet.getCell('A1').value = "Année";
    worksheet.getCell('B1').value = "Date debut / date Fin";
    worksheet.getCell('C1').value = "Formation";
    worksheet.getCell('D1').value = "Nbre bénéficiaires";
    worksheet.getCell('E1').value = "Femme";
    worksheet.getCell('G1').value = "Homme";
    worksheet.getCell('I1').value = "Age moyen";
    worksheet.getCell('J1').value = "Sans Bac";
    worksheet.getCell('L1').value = "Bac";
    worksheet.getCell('N1').value = "Bac+2";
    worksheet.getCell('P1').value = "Bac+3";
    worksheet.getCell('R1').value = "Bac+5";
    worksheet.getCell('T1').value = "Étrangers";
    worksheet.getCell('V1').value = "En formation";
    worksheet.getCell('X1').value = "recherche d'emp";
    worksheet.getCell('Z1').value = "Employé";
    
    // Ajouter les en-têtes des sous-colonnes (Nbre et %)
    worksheet.getCell('E2').value = "Nbre";
    worksheet.getCell('F2').value = "%";
    worksheet.getCell('G2').value = "Nbre";
    worksheet.getCell('H2').value = "%";
    worksheet.getCell('J2').value = "Nbre";
    worksheet.getCell('K2').value = "%";
    worksheet.getCell('L2').value = "Nbre";
    worksheet.getCell('M2').value = "%";
    worksheet.getCell('N2').value = "Nbre";
    worksheet.getCell('O2').value = "%";
    worksheet.getCell('P2').value = "Nbre";
    worksheet.getCell('Q2').value = "%";
    worksheet.getCell('R2').value = "Nbre";
    worksheet.getCell('S2').value = "%";
    worksheet.getCell('T2').value = "Nbre";
    worksheet.getCell('U2').value = "%";
    worksheet.getCell('V2').value = "Nbre";
    worksheet.getCell('W2').value = "%";
    worksheet.getCell('X2').value = "Nbre";
    worksheet.getCell('Y2').value = "%";
    worksheet.getCell('Z2').value = "Nbre";
    worksheet.getCell('AA2').value = "%";
    
    // Définir la largeur des colonnes
    worksheet.getColumn('A').width = 10;
    worksheet.getColumn('B').width = 10;
    worksheet.getColumn('C').width = 25;
    worksheet.getColumn('D').width = 15;
    worksheet.getColumn('E').width = 8;
    worksheet.getColumn('F').width = 8;
    worksheet.getColumn('G').width = 8;
    worksheet.getColumn('H').width = 8;
    worksheet.getColumn('I').width = 12;
    worksheet.getColumn('J').width = 8;
    worksheet.getColumn('K').width = 8;
    // Définir les largeurs pour les autres colonnes...
    
    // Remplissage des données
    let rowIndex = 4; // Commencer après les lignes d'en-tête
    
    data.forEach((item) => {
      // Formatage de la date
      const formatDate = (dateValue) => {
        if (!dateValue) return "N/A";
        if (typeof dateValue === "string") return dateValue.split("T")[0];
        if (dateValue instanceof Date) return dateValue.toISOString().split("T")[0];
        return "N/A";
      };
      
      const dateDebut = formatDate(item.periode?.dateDebut);
      const dateFin=formatDate(item.periode?.dateFin);
      const dateFormatted = (dateDebut === "N/A" || dateFin === "N/A")  ? "N/A" : `${dateDebut.substring(5, 10)} / ${dateFin.substring(5, 10)}`;
      
      // Préparation des données
      const stats = item.statistiques || {};
      const genre = stats.genre || {};
      const niveauEtudes = stats.niveauEtudes || {};
      const situationPro = stats.situationProfessionnelle || {};
      
      // Récupérer les valeurs ou utiliser des valeurs par défaut
      const total = stats.total || 0;
      const femmesNombre = genre.femmes?.nombre || 0;
      const femmesPct = genre.femmes?.pourcentage || 0;
      const hommesNombre = genre.hommes?.nombre || 0;
      const hommesPct = genre.hommes?.pourcentage || 0;
      const ageCategorie = stats.categorieAge || "N/A";
      
      const sansBacNombre = niveauEtudes.sansBac?.nombre || 0;
      const sansBacPct = niveauEtudes.sansBac?.pourcentage || 0;
      const bacNombre = niveauEtudes.bac?.nombre || 0;
      const bacPct = niveauEtudes.bac?.pourcentage || 0;
      const bac2Nombre = niveauEtudes.bac2?.nombre || 0;
      const bac2Pct = niveauEtudes.bac2?.pourcentage || 0;
      const bac3Nombre = niveauEtudes.bac3?.nombre || 0;
      const bac3Pct = niveauEtudes.bac3?.pourcentage || 0;
      const bac5Nombre = niveauEtudes.bac5?.nombre || 0;
      const bac5Pct = niveauEtudes.bac5?.pourcentage || 0;
      
      const etrangersNombre = stats.etrangers?.nombre || 0;
      const etrangersPct = stats.etrangers?.pourcentage || 0;
      const etudiantsNombre = situationPro.etudiants?.nombre || 0;
      const etudiantsPct = situationPro.etudiants?.pourcentage || 0;
      const rechercheEmploiNombre = situationPro.rechercheEmploi?.nombre || 0;
      const rechercheEmploiPct = situationPro.rechercheEmploi?.pourcentage || 0;
      const employesNombre = situationPro.employes?.nombre || 0;
      const employesPct = situationPro.employes?.pourcentage || 0;
      
      // Remplir les données dans les cellules
      worksheet.getCell(`A${rowIndex}`).value = item.annee;
      worksheet.getCell(`B${rowIndex}`).value = dateFormatted;
      worksheet.getCell(`C${rowIndex}`).value = item.nomFormation;
      worksheet.getCell(`D${rowIndex}`).value = total;
      worksheet.getCell(`E${rowIndex}`).value = femmesNombre;
      worksheet.getCell(`F${rowIndex}`).value = `${femmesPct.toFixed(2)}%`;
      worksheet.getCell(`G${rowIndex}`).value = hommesNombre;
      worksheet.getCell(`H${rowIndex}`).value = `${hommesPct.toFixed(2)}%`;
      worksheet.getCell(`I${rowIndex}`).value = ageCategorie;
      worksheet.getCell(`J${rowIndex}`).value = sansBacNombre;
      worksheet.getCell(`K${rowIndex}`).value = `${sansBacPct.toFixed(2)}%`;
      worksheet.getCell(`L${rowIndex}`).value = bacNombre;
      worksheet.getCell(`M${rowIndex}`).value = `${bacPct.toFixed(2)}%`;
      worksheet.getCell(`N${rowIndex}`).value = bac2Nombre;
      worksheet.getCell(`O${rowIndex}`).value = `${bac2Pct.toFixed(2)}%`;
      worksheet.getCell(`P${rowIndex}`).value = bac3Nombre;
      worksheet.getCell(`Q${rowIndex}`).value = `${bac3Pct.toFixed(2)}%`;
      worksheet.getCell(`R${rowIndex}`).value = bac5Nombre;
      worksheet.getCell(`S${rowIndex}`).value = `${bac5Pct.toFixed(2)}%`;
      worksheet.getCell(`T${rowIndex}`).value = etrangersNombre;
      worksheet.getCell(`U${rowIndex}`).value = `${etrangersPct.toFixed(2)}%`;
      worksheet.getCell(`V${rowIndex}`).value = etudiantsNombre;
      worksheet.getCell(`W${rowIndex}`).value = `${etudiantsPct.toFixed(2)}%`;
      worksheet.getCell(`X${rowIndex}`).value = rechercheEmploiNombre;
      worksheet.getCell(`Y${rowIndex}`).value = `${rechercheEmploiPct.toFixed(2)}%`;
      worksheet.getCell(`Z${rowIndex}`).value = employesNombre;
      worksheet.getCell(`AA${rowIndex}`).value = `${employesPct.toFixed(2)}%`;
      
      rowIndex++;
    });
    
    // Style du tableau
    for (let i = 1; i <= rowIndex - 1; i++) {
      for (let col = 'A'.charCodeAt(0); col <= 'AA'.charCodeAt(0); col++) {
        const cellAddress = String.fromCharCode(col) + i;
        if (worksheet.getCell(cellAddress).value !== undefined) {
          worksheet.getCell(cellAddress).border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
          };
        }
      }
    }
    
    // Couleur d'arrière-plan pour les en-têtes principaux
    for (let col = 'A'.charCodeAt(0); col <= 'AA'.charCodeAt(0); col++) {
      const cellAddress = String.fromCharCode(col) + '1';
      if (worksheet.getCell(cellAddress).value !== undefined) {
        worksheet.getCell(cellAddress).fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFA500' }  // Orange
        };
        worksheet.getCell(cellAddress).font = { bold: true, color: { argb: '000000' } };
        worksheet.getCell(cellAddress).alignment = { vertical: 'middle', horizontal: 'center' };
      }
    }
  
    // Couleur pour les lignes d'en-tête secondaires
    ['E2', 'F2', 'G2', 'H2', 'J2', 'K2', 'L2', 'M2', 'N2', 'O2', 'P2', 'Q2', 'R2', 'S2', 'T2', 'U2', 'V2', 'W2', 'X2', 'Y2', 'Z2', 'AA2'].forEach(cell => {
      worksheet.getCell(cell).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFFCE5' }  // Légère teinte orange
      };
      worksheet.getCell(cell).font = { bold: true };
      worksheet.getCell(cell).alignment = { vertical: 'middle', horizontal: 'center' };
    });
    
    return workbook.xlsx.writeBuffer();
  };
module.exports = {convertirRapportEnExcel,genererRapportData,analyserBeneficiaires ,getFormationsTermineesByFormateurs,getFormateurIdsByEntities,convertirRapportEnExcel};