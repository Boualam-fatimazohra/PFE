    const PDFDocument = require('pdfkit');
    const fs = require('fs');
    const BeneficiareFormation = require('../Models/beneficiairesFormation.js');
    const {genererJoursFormation} = require("./BeneficiairePresence.js");

    const genererPDF = (beneficiaire, formation, outputPath) => {
    return new Promise((resolve, reject) => {
        try {
        const doc = new PDFDocument({
            size: 'A4',
            margins: { top: 50, bottom: 50, left: 72, right: 72 }
        });

        // Pipe le document PDF vers un fichier
        const stream = fs.createWriteStream(outputPath);
        doc.pipe(stream);

        // Formater les dates
        const dateDebut = formation.dateDebut ? new Date(formation.dateDebut).toLocaleDateString('fr-FR') : 'Non spécifiée';
        const dateFin = formation.dateFin ? new Date(formation.dateFin).toLocaleDateString('fr-FR') : 'Non spécifiée';
        const dateGeneration = new Date().toLocaleDateString('fr-FR');

        // Ajouter un titre
        doc.fontSize(24)
            .font('Helvetica-Bold')
            .text('CERTIFICAT DE PARTICIPATION', { align: 'center' })
            .moveDown(2);

        // Ajouter le contenu
        doc.fontSize(14)
            .font('Helvetica')
            .text('Ce certificat est décerné à:', { align: 'center' })
            .moveDown(0.5);

        doc.fontSize(18)
            .font('Helvetica-Bold')
            .text(`${beneficiaire.prenom || ''} ${beneficiaire.nom}`, { align: 'center' })
            .moveDown(2);

        doc.fontSize(14)
            .font('Helvetica')
            .text('Pour avoir participé avec succès à la formation:', { align: 'center' })
            .moveDown(0.5);

        doc.fontSize(18)
            .font('Helvetica-Bold')
            .text(formation.nom, { align: 'center' })
            .moveDown(2);

        // Informations détaillées sur la formation
        doc.fontSize(12)
            .font('Helvetica')
            .text(`Date de début: ${dateDebut}`, { align: 'center' })
            .text(`Date de fin: ${dateFin}`, { align: 'center' })
            .moveDown(0.5);

        if (formation.description && formation.description !== 'Aucun description') {
            doc.fontSize(12)
            .font('Helvetica')
            .text('Description de la formation:', { align: 'center' })
            .moveDown(0.5)
            .fontSize(10)
            .text(formation.description, { align: 'center' })
            .moveDown(1);
        }

        // Formateur
        if (formation.formateur && formation.formateur.nom) {
            doc.fontSize(12)
            .font('Helvetica')
            .text(`Formateur: ${formation.formateur.prenom || ''} ${formation.formateur.nom}`, { align: 'center' })
            .moveDown(2);
        }

        // Date de génération du certificat
        doc.fontSize(10)
            .font('Helvetica')
            .text(`Certificat généré le ${dateGeneration}`, { align: 'center' })
            .moveDown(2);

        // Signature
        doc.fontSize(12)
            .font('Helvetica-Bold')
            .text('Signature', { align: 'right' })
            .moveDown(0.5)
            .font('Helvetica')
            .text('__________________', { align: 'right' });

        // Finaliser le document
        doc.end();

        stream.on('finish', () => {
            resolve();
        });

        stream.on('error', (err) => {
            reject(err);
        });
        } catch (error) {
        reject(error);
        }
    });
    };
    const calculerJoursPresenceBeneficiaires = async (idsFormationBeneficiaire) => {
        try {
        // Vérifier si la liste des IDs est fournie
        if (!idsFormationBeneficiaire || !Array.isArray(idsFormationBeneficiaire) || idsFormationBeneficiaire.length === 0) {
            throw new Error("La liste des IDs des bénéficiaires de formation est requise");
        }
    
        // Tableau pour stocker les résultats
        const resultats = [];
    
        // Traiter chaque ID de bénéficiaire de formation
        for (const idBeneficiaire of idsFormationBeneficiaire) {
            try {
            // Récupérer les informations du bénéficiaire
            const beneficiaireFormation = await BeneficiareFormation.findById(idBeneficiaire);
            if (!beneficiaireFormation) {
                resultats.push({
                idBeneficiaire,
                success: false,
                message: 'Bénéficiaire de formation non trouvé',
                nombreJoursPresent: 0,
                nombreTotalJours: 0
                });
                continue;
            }
    
            // Récupérer les informations de la formation
            const formation = await Formation.findById(beneficiaireFormation.formation);
            if (!formation) {
                resultats.push({
                idBeneficiaire,
                success: false,
                message: 'Formation associée non trouvée',
                nombreJoursPresent: 0,
                nombreTotalJours: 0
                });
                continue;
            }
    
            // Calculer le nombre total de jours de formation
            const joursFormation = genererJoursFormation(formation.dateDebut, formation.dateFin);
            const nombreTotalJours = joursFormation.length;
    
            if (nombreTotalJours === 0) {
                resultats.push({
                idBeneficiaire,
                success: false,
                message: 'Aucun jour de formation trouvé (vérifiez les dates)',
                nombreJoursPresent: 0,
                nombreTotalJours: 0
                });
                continue;
            }
    
            // Récupérer toutes les présences pour ce bénéficiaire
            const presences = await Presence.find({ beneficiareFormation: idBeneficiaire });
            
            // Compter le nombre de jours présent
            const nombreJoursPresent = presences.filter(presence => presence.isPresent).length;
    
            // Ajouter les résultats au tableau
            resultats.push({
                idBeneficiaire,
                idFormation: formation._id,
                nombreJoursPresent,
                nombreTotalJours,
                success: true
            });
            } catch (error) {
            console.error(`Erreur lors du traitement du bénéficiaire ${idBeneficiaire}:`, error);
            resultats.push({
                idBeneficiaire,
                success: false,
                message: `Erreur: ${error.message}`,
                nombreJoursPresent: 0,
                nombreTotalJours: 0
            });
            }
        }
    
        return resultats;
        } catch (error) {
        console.error("Erreur lors du calcul des présences:", error);
        throw error;
        }
    };
    
    
   
    
    module.exports = {
        calculerJoursPresenceBeneficiaires,
        genererPDF
    };