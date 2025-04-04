const { calculerJoursPresenceBeneficiaires,genererPDF} = require("../utils/beneficiaireCertification.js");
const path = require("path");
const fs = require("fs");
const archiver = require("archiver");
const { v4: uuidv4 } = require('uuid');
const BeneficiareFormation = require("../Models/beneficiairesFormation.js");
// controlleur pour vérifier la validité des certificats de presences mais qui ne sera plus utilisé , il sera affecter au formateur
const verifierValiditeCertifications = async (req, res) => {
    try {
      const { idsBeneficiaires } = req.body;
      
      if (!idsBeneficiaires || !Array.isArray(idsBeneficiaires)) {
        return res.status(400).json({
          success: false,
          message: "La liste des IDs des bénéficiaires est requise"
        });
      }
      
      // Appeler la fonction pour obtenir les jours de présence
      const resultatsPresences = await calculerJoursPresenceBeneficiaires(idsBeneficiaires);
      
      // Calculer les taux de présence et déterminer l'éligibilité à la certification
      const resultatsFinaux = resultatsPresences.map(resultat => {
        if (!resultat.success) {
          return {
            ...resultat,
            tauxPresence: 0,
            eligibleCertification: false
          };
        }
        
        // Calculer le taux de présence
        const tauxPresence = (resultat.nombreJoursPresent / resultat.nombreTotalJours) * 100;
        
        // Déterminer l'éligibilité (exemple: taux >= 80%)
        const eligibleCertification = tauxPresence >= 80;
        
        return {
          ...resultat,
          tauxPresence: parseFloat(tauxPresence.toFixed(2)),
          eligibleCertification
        };
      });
      
      return res.status(200).json({
        success: true,
        message: "Vérification des présences effectuée avec succès",
        data: resultatsFinaux
      });
    } catch (error) {
      console.error("Erreur lors de la vérification des certifications:", error);
      return res.status(500).json({
        success: false,
        message: "Une erreur est survenue lors de la vérification des certifications",
        error: error.message
      });
    }
  };
  // Contrôleur pour générer les certificats PDF et les télécharger en ZIP 
  const genererEtTelechargerCertificats = async (req, res) => {
    try {
      const { idsBeneficiairesFormation } = req.body;
      
      if (!idsBeneficiairesFormation || !Array.isArray(idsBeneficiairesFormation) || idsBeneficiairesFormation.length === 0) {
        return res.status(400).json({
          success: false,
          message: "La liste des IDs des bénéficiaires de formation est requise"
        });
      }
  
      // Créer un dossier temporaire pour les PDFs individuels
      const tempDir = path.join(__dirname, '../temp', uuidv4());
      if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, { recursive: true });
      }
  
      const pdfFilePaths = [];
  
      // Traiter chaque ID de bénéficiaire de formation
      for (const id of idsBeneficiairesFormation) {
        try {
          // Récupérer les données du bénéficiaire et de la formation
          const beneficiaireFormation = await BeneficiareFormation.findById(id)
            .populate('beneficiaire')
            .populate('formation')
            .exec();
  
          if (!beneficiaireFormation || !beneficiaireFormation.beneficiaire || !beneficiaireFormation.formation) {
            console.warn(`Données incomplètes pour le bénéficiaire de formation avec ID ${id}, ignoré.`);
            continue;
          }
  
          // Créer un nom de fichier sécurisé
          const fileName = `certificat_${beneficiaireFormation.beneficiaire._id}_${beneficiaireFormation.formation._id}.pdf`;
          const filePath = path.join(tempDir, fileName);
  
          // Générer le PDF
          await genererPDF(beneficiaireFormation.beneficiaire, beneficiaireFormation.formation, filePath);
          pdfFilePaths.push(filePath);
        } catch (error) {
          console.error(`Erreur lors de la génération du PDF pour l'ID ${id}:`, error);
        }
      }
  
      // Si aucun PDF n'a été généré, lever une erreur
      if (pdfFilePaths.length === 0) {
        throw new Error('Aucun certificat n\'a pu être généré');
      }
  
      // Préparer la réponse HTTP pour le téléchargement
      const zipFileName = `certificats_${Date.now()}.zip`;
      res.setHeader('Content-Type', 'application/zip');
      res.setHeader('Content-Disposition', `attachment; filename="${zipFileName}"`);
  
      // Créer un flux d'archive qui écrira directement dans la réponse HTTP
      const archive = archiver('zip', {
        zlib: { level: 9 } // Niveau de compression maximum
      });
  
      // Gérer les erreurs d'archive
      archive.on('error', (err) => {
        console.error('Erreur lors de la création du ZIP:', err);
        // Nettoyer les PDF temporaires
        pdfFilePaths.forEach(file => {
          try {
            fs.unlinkSync(file);
          } catch (error) {
            console.warn(`Impossible de supprimer le fichier temporaire ${file}:`, error);
          }
        });
        
        // Supprimer le dossier temporaire
        try {
          fs.rmdirSync(tempDir, { recursive: true });
        } catch (error) {
          console.warn(`Impossible de supprimer le dossier temporaire ${tempDir}:`, error);
        }
        
        // Ne pas envoyer d'erreur si les en-têtes ont déjà été envoyés
        if (!res.headersSent) {
          res.status(500).json({
            success: false,
            message: "Erreur lors de la création du fichier ZIP",
            error: err.message
          });
        }
      });
  
      // Connecter l'archive directement à la réponse HTTP
      archive.pipe(res);
  
      // Ajouter chaque fichier PDF au ZIP
      for (const filePath of pdfFilePaths) {
        const fileName = path.basename(filePath);
        archive.file(filePath, { name: fileName });
      }
  
      // Finaliser l'archive et déclencher le téléchargement
      await archive.finalize();
  
      // Nettoyer les fichiers PDF temporaires une fois l'archive envoyée
      pdfFilePaths.forEach(file => {
        try {
          fs.unlinkSync(file);
        } catch (error) {
          console.warn(`Impossible de supprimer le fichier temporaire ${file}:`, error);
        }
      });
  
      // Supprimer le dossier temporaire
      try {
        fs.rmdirSync(tempDir, { recursive: true });
      } catch (error) {
        console.warn(`Impossible de supprimer le dossier temporaire ${tempDir}:`, error);
      }
  
    } catch (error) {
      console.error("Erreur lors de la génération des certificats:", error);
      return res.status(500).json({
        success: false,
        message: "Une erreur est survenue lors de la génération des certificats",
        error: error.message
      });
    }
  };
  
  module.exports = { verifierValiditeCertifications, genererEtTelechargerCertificats };