const {analyserBeneficiaires ,getFormationsTermineesByFormateurs,getFormateurIdsByEntities} =require("../utils/rapportUtils");
const {getBeneficiairesByFormation} =require("../utils/BeneficiairePresence");
const createRapport = async (req, res) => {
  console.log("Create rapport");
  try {
    
    const { dateDebut, dateFin, entityIds } = req.body;
    
    // Validation des entrées
    if (!dateDebut || !dateFin || !entityIds) {
      return res.status(400).json({
        success: false,
        message: "Les dates de début et fin, ainsi que les IDs des entités sont obligatoires"
      });
    }
    
    // Récupération des IDs de formateurs à partir des IDs d'entités
    const formateurIds = await getFormateurIdsByEntities(entityIds);
    
    if (formateurIds.length === 0) {
      return res.status(200).json({
        success: true,
        message: "Aucun formateur trouvé pour les entités spécifiées",
        data: []
      });
    }
    
    // Conversion des dates
    const dateDebutObj = new Date(dateDebut);
    const dateFinObj = new Date(dateFin);
    
    // Récupération des formations
    const formations = await getFormationsTermineesByFormateurs(formateurIds, dateDebutObj, dateFinObj);
    
    if (formations.length === 0) {
      return res.status(200).json({
        success: true,
        message: "Aucune formation trouvée pour la période et les formateurs spécifiés",
        data: []
      });
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
        formationId: formation._id,
        nomFormation: formation.nom,
        formateur: formation.formateur, // Si vous avez fait le populate, sinon ce sera juste l'ID
        statistiques: statistiques
      });
    }
    
    // Tri des formations par année (du plus récent au plus ancien)
    rapportComplet.sort((a, b) => b.annee - a.annee);
    
    res.status(200).json({
      success: true,
      count: rapportComplet.length,
      data: rapportComplet
    });
    
  } catch (error) {
    console.log("error : ", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la création du rapport",
      error: error.message
    });
  }
};

module.exports=  {createRapport}