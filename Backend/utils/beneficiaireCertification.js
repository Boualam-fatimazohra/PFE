    const PDFDocument = require('pdfkit');
    const fs = require('fs');
    const BeneficiareFormation = require('../Models/beneficiairesFormation.js');
    const {genererJoursFormation} = require("./BeneficiairePresence.js");

    // const genererPDF = (beneficiaire, formation, outputPath) => {
    //     return new Promise((resolve, reject) => {
    //         try {
    //         const doc = new PDFDocument({
    //             size: 'A4',
    //             margins: { top: 50, bottom: 50, left: 72, right: 72 }
    //         });
    
    //         // Pipe le document PDF vers un fichier
    //         const stream = fs.createWriteStream(outputPath);
    //         doc.pipe(stream);
    
    //         // Formater les dates
    //         const dateDebut = formation.dateDebut ? new Date(formation.dateDebut).toLocaleDateString('fr-FR') : 'Non spécifiée';
    //         const dateFin = formation.dateFin ? new Date(formation.dateFin).toLocaleDateString('fr-FR') : 'Non spécifiée';
    //         const dateGeneration = new Date().toLocaleDateString('fr-FR');
    
    //         // Ajouter un titre
    //         doc.fontSize(24)
    //             .font('Helvetica-Bold')
    //             .text('CERTIFICAT DE PARTICIPATION', { align: 'center' })
    //             .moveDown(2);
    
    //         // Ajouter le contenu
    //         doc.fontSize(14)
    //             .font('Helvetica')
    //             .text('Ce certificat est décerné à:', { align: 'center' })
    //             .moveDown(0.5);
    
    //         doc.fontSize(18)
    //             .font('Helvetica-Bold')
    //             .text(`${beneficiaire.prenom || ''} ${beneficiaire.nom}`, { align: 'center' })
    //             .moveDown(2);
    
    //         doc.fontSize(14)
    //             .font('Helvetica')
    //             .text('Pour avoir participé avec succès à la formation:', { align: 'center' })
    //             .moveDown(0.5);
    
    //         doc.fontSize(18)
    //             .font('Helvetica-Bold')
    //             .text(formation.nom, { align: 'center' })
    //             .moveDown(2);
    
    //         // Informations détaillées sur la formation
    //         doc.fontSize(12)
    //             .font('Helvetica')
    //             .text(`Date de début: ${dateDebut}`, { align: 'center' })
    //             .text(`Date de fin: ${dateFin}`, { align: 'center' })
    //             .moveDown(0.5);
    
    //         if (formation.description && formation.description !== 'Aucun description') {
    //             doc.fontSize(12)
    //             .font('Helvetica')
    //             .text('Description de la formation:', { align: 'center' })
    //             .moveDown(0.5)
    //             .fontSize(10)
    //             .text(formation.description, { align: 'center' })
    //             .moveDown(1);
    //         }
    
    //         // Formateur
    //         if (formation.formateur && formation.formateur.nom) {
    //             doc.fontSize(12)
    //             .font('Helvetica')
    //             .text(`Formateur: ${formation.formateur.prenom || ''} ${formation.formateur.nom}`, { align: 'center' })
    //             .moveDown(2);
    //         }
    
    //         // Date de génération du certificat
    //         doc.fontSize(10)
    //             .font('Helvetica')
    //             .text(`Certificat généré le ${dateGeneration}`, { align: 'center' })
    //             .moveDown(2);
    
    //         // Signature
    //         doc.fontSize(12)
    //             .font('Helvetica-Bold')
    //             .text('Signature', { align: 'right' })
    //             .moveDown(0.5)
    //             .font('Helvetica')
    //             .text('__________________', { align: 'right' });
    
    //         // Finaliser le document
    //         doc.end();
    
    //         stream.on('finish', () => {
    //             resolve();
    //         });
    
    //         stream.on('error', (err) => {
    //             reject(err);
    //         });
    //         } catch (error) {
    //         reject(error);
    //         }
    //     });
    //     };
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
    // const genererPDF = (beneficiaire, formation, outputPath) => {
    //     return new Promise((resolve, reject) => {
    //         try {
    //             const doc = new PDFDocument({
    //                 size: 'A4',
    //                 margins: { top: 50, bottom: 50, left: 50, right: 50 }
    //             });
    
    //             const stream = fs.createWriteStream(outputPath);
    //             doc.pipe(stream);
    
    //             // Dates formatées
    //             const dateDebut = formation.dateDebut ?
    //                 new Date(formation.dateDebut).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' }) : 'Non spécifiée';
    //             const dateFin = formation.dateFin ?
    //                 new Date(formation.dateFin).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' }) : 'Non spécifiée';
    
    //             // Ajouter barre latérale avec motifs géométriques
    //             doc.save()
    //                .rect(0, 0, 50, doc.page.height)
    //                .fill('#FF4500'); // Couleur orange
    
    //             // Ajouter les motifs géométriques sur la barre latérale
    //             const patterns = [
    //                 { y: 20, shape: 'circle', size: 20 },
    //                 { y: 70, shape: 'square', size: 20 },
    //                 { y: 120, shape: 'triangle', size: 20 },
    //                 { y: 170, shape: 'diamond', size: 20 },
    //                 { y: 220, shape: 'star', size: 20 },
    //                 { y: 270, shape: 'line', size: 20 },
    //                 { y: 320, shape: 'dot', size: 20 },
    //                 { y: 370, shape: 'circle', size: 20 }
    //             ];
    
    //             patterns.forEach(pattern => {
    //                 doc.save();
    //                 doc.translate(25, pattern.y + pattern.size/2);
                    
    //                 switch(pattern.shape) {
    //                     case 'circle':
    //                         doc.circle(0, 0, pattern.size/2).fill('white');
    //                         break;
    //                     case 'square':
    //                         doc.rect(-pattern.size/2, -pattern.size/2, pattern.size, pattern.size).fill('white');
    //                         break;
    //                     case 'triangle':
    //                         doc.moveTo(0, -pattern.size/2)
    //                            .lineTo(pattern.size/2, pattern.size/2)
    //                            .lineTo(-pattern.size/2, pattern.size/2)
    //                            .fill('white');
    //                         break;
    //                     case 'diamond':
    //                         doc.moveTo(0, -pattern.size/2)
    //                            .lineTo(pattern.size/2, 0)
    //                            .lineTo(0, pattern.size/2)
    //                            .lineTo(-pattern.size/2, 0)
    //                            .fill('white');
    //                         break;
    //                     case 'star':
    //                         // Simplifié pour un motif en étoile
    //                         doc.circle(0, 0, pattern.size/2).fill('white');
    //                         break;
    //                     case 'line':
    //                         doc.rect(-pattern.size/2, -pattern.size/6, pattern.size, pattern.size/3).fill('white');
    //                         break;
    //                     case 'dot':
    //                         doc.circle(0, 0, pattern.size/4)
    //                            .circle(0, pattern.size/2, pattern.size/4)
    //                            .circle(0, -pattern.size/2, pattern.size/4)
    //                            .fill('white');
    //                         break;
    //                 }
    //                 doc.restore();
    //             });
    
    //             // Ajouter logo Orange dans le coin supérieur gauche
    //             doc.save()
    //                .translate(100, 80)
    //                .rect(0, 0, 30, 30)
    //                .fill('#FF4500');
                
    //             doc.fontSize(8)
    //                .fill('white')
    //                .text('orange', 2, 10, { width: 26, height: 20, align: 'center' });
    //             doc.restore();
    
    //             // Titre
    //             doc.font('Helvetica-Bold')
    //                .fontSize(32)
    //                .fill('#FF4500')
    //                .text('Certificate', 85, 150);
                
    //             doc.font('Helvetica-Bold')
    //                .fontSize(32)
    //                .fill('#FF4500')
    //                .text('of attendance', 85, 190);
    
    //             // Sous-titre
    //             doc.font('Helvetica')
    //                .fontSize(12)
    //                .fill('black')
    //                .text('Orange Digital Center Agadir certifies', 85, 240);
    
    //             // Nom du bénéficiaire
    //             doc.font('Helvetica-Oblique')
    //                .fontSize(16)
    //                .fill('#C06060')  // Couleur rouge-rosé comme sur l'image
    //                .text(`${beneficiaire.prenom} ${beneficiaire.nom}`, 85, 280);
    
    //             // Participation
    //             doc.font('Helvetica')
    //                .fontSize(12)
    //                .fill('black')
    //                .text('Has actively participated in', 85, 320);
                
    //             // Nom de la formation
    //             doc.font('Helvetica-Oblique')
    //                .fontSize(16)
    //                .fill('#C06060')
    //                .text(`${formation.nom}`, 265, 320);
                
    //             // Organisateur
    //             doc.font('Helvetica')
    //                .fontSize(12)
    //                .fill('black')
    //                .text('training organized by the Orange Digital Center Agadir', 85, 350);
                
    //             // Dates
    //             doc.font('Helvetica')
    //                .fontSize(12)
    //                .fill('black')
    //                .text('From the', 85, 380);
                
    //             doc.font('Helvetica-Oblique')
    //                .fontSize(16)
    //                .fill('#C06060')
    //                .text(`${dateDebut}`, 150, 380);
                
    //             doc.font('Helvetica')
    //                .fontSize(12)
    //                .fill('black')
    //                .text('to', 170, 380);
                
    //             doc.font('Helvetica-Oblique')
    //                .fontSize(16)
    //                .fill('#C06060')
    //                .text(`${dateFin}`, 190, 380);
                
    //             // URL
    //             doc.font('Helvetica')
    //                .fontSize(10)
    //                .fill('#FF4500')
    //                .text('www.orangedigitalcenters.com', 85, 500);
                
    //             // Signature
    //             doc.fontSize(10)
    //                .fill('black')
    //                .text('Mme.Nadia Mrabi', 450, 450, { align: 'right' });
                
    //             doc.fontSize(8)
    //                .text('Senior Manager CSR & Program', 450, 465, { align: 'right' })
    //                .text('Orange Digital Center Maroc', 450, 480, { align: 'right' });
                
    //             // Image de signature (à remplacer par une véritable image)
    //             doc.moveTo(450, 440)
    //                .lineTo(530, 440)
    //                .lineWidth(1)
    //                .stroke();
    
    //             doc.end();
    
    //             stream.on('finish', () => resolve());
    //             stream.on('error', (err) => reject(err));
    
    //         } catch (error) {
    //             reject(error);
    //         }
    //     });
    // };
    const genererPDF = (beneficiaire, formation, outputPath) => {
        return new Promise((resolve, reject) => {
            try {
                // Format rectangulaire comme l'image
                const doc = new PDFDocument({
                    size: [842, 595], // Format A4 paysage
                    margins: { top: 50, bottom: 50, left: 50, right: 50 }
                });
    
                const stream = fs.createWriteStream(outputPath);
                doc.pipe(stream);
    
                // Arrière-plan blanc
                doc.rect(0, 0, doc.page.width, doc.page.height).fill('#ffffff');
    
                // Largeur de la barre latérale
                const sidebarWidth = 90;
    
                // Ajouter barre latérale orange avec motifs géométriques
                doc.save()
                   .rect(0, 0, sidebarWidth, doc.page.height)
                   .fill('#FF4500'); // Couleur orange
    
                // Ajouter les motifs géométriques sur la barre latérale - centrés et espacés
                const patterns = [
                    { y: 50, shape: 'square', size: 30 },
                    { y: 130, shape: 'triangle', size: 30 },
                    { y: 210, shape: 'diamond', size: 30 },
                    { y: 290, shape: 'circle', size: 30 },
                    { y: 370, shape: 'rect', size: 30 },
                    { y: 450, shape: 'circle-dots', size: 30 },
                    { y: 530, shape: 'star', size: 30 }
                ];
    
                patterns.forEach(pattern => {
                    doc.save();
                    doc.translate(sidebarWidth/2, pattern.y);
                    
                    switch(pattern.shape) {
                        case 'square':
                            doc.rect(-pattern.size/2, -pattern.size/2, pattern.size, pattern.size).fill('white');
                            break;
                        case 'triangle':
                            doc.moveTo(0, -pattern.size/2)
                               .lineTo(pattern.size/2, pattern.size/2)
                               .lineTo(-pattern.size/2, pattern.size/2)
                               .fill('white');
                            break;
                        case 'diamond':
                            doc.moveTo(0, -pattern.size/2)
                               .lineTo(pattern.size/2, 0)
                               .lineTo(0, pattern.size/2)
                               .lineTo(-pattern.size/2, 0)
                               .fill('white');
                            break;
                        case 'circle':
                            doc.circle(0, 0, pattern.size/2).fill('white');
                            break;
                        case 'rect':
                            doc.rect(-pattern.size/2, -pattern.size/6, pattern.size, pattern.size/3).fill('white');
                            break;
                        case 'circle-dots':
                            doc.circle(-5, 0, pattern.size/4).fill('white');
                            doc.circle(5, 0, pattern.size/4).fill('white');
                            break;
                        case 'star':
                            // Un cercle simple pour ce motif
                            doc.circle(0, 0, pattern.size/2).fill('white');
                            break;
                    }
                    doc.restore();
                });
    
                // Position de départ pour le contenu (après la barre latérale)
                const contentX = sidebarWidth + 60;
    
                // Ajouter logo Orange
                doc.save()
                   .translate(contentX, 60)
                   .rect(0, 0, 50, 50)
                   .fill('#FF4500');
                
                doc.fontSize(12)
                   .fill('white')
                   .text('orange',8,13,{ width: 24, align: 'center' });
                doc.restore();
    
                // Titre
                doc.font('Helvetica-Bold')
                   .fontSize(36)
                   .fill('#FF4500')
                   .text('Certificate', contentX, 150);
                
                doc.font('Helvetica-Bold')
                   .fontSize(36)
                   .fill('#FF4500')
                   .text('of attendance', contentX, 200);
    
                // Sous-titre
                doc.font('Helvetica')
                   .fontSize(14)
                   .fill('black')
                   .text('Orange Digital Center Agadir certifies', contentX, 260);
    
                // Nom du bénéficiaire - en rouge/rose italique comme dans l'image
                doc.font('Helvetica-Oblique')
                   .fontSize(18)
                   .fill('#C06060') 
                   .text(`${beneficiaire.prenom} ${beneficiaire.nom}`, contentX, 300);
    
                // Ajout d'espace avant "Has actively participated"
                doc.moveDown(1.5);
    
                // IMPORTANT: Tout le texte ci-dessous commence à partir de la marge de contenu
                // pour éviter le chevauchement avec la barre latérale
                
                // Participation
                doc.font('Helvetica')
                   .fontSize(14)
                   .fill('black')
                   .text('Has actively participated in', contentX, 350);
                
                // Nom de la formation - en rouge/rose italique à droite
                doc.font('Helvetica-Oblique')
                   .fontSize(18)
                   .fill('#C06060')
                   .text(`${formation.nom}`, contentX + 230, 350);
                
                // Organisateur
                doc.font('Helvetica')
                   .fontSize(14)
                   .fill('black')
                   .text('training organized by the Orange Digital Center Agadir', contentX, 380);
                
                // Dates 
                doc.font('Helvetica')
                   .fontSize(14)
                   .fill('black')
                   .text('From the', contentX, 420);
                
                // Format de date corrigé (01 mars 2025)
                doc.font('Helvetica-Oblique')
                   .fontSize(18)
                   .fill('#C06060')
                   .text(`${formation.dateDebut}`, contentX + 100, 420);
                
                doc.font('Helvetica')
                   .fontSize(14)
                   .fill('black')
                   .text('to', contentX + 250, 420);
                
                doc.font('Helvetica-Oblique')
                   .fontSize(18)
                   .fill('#C06060')
                   .text(`${formation.dateFin}`, contentX + 280, 420);
                
                // URL en bas à gauche - maintenant placée après la barre latérale
                doc.font('Helvetica')
                   .fontSize(12)
                   .fill('#FF4500')
                   .text('www.orangedigitalcenters.com', contentX, 520);
                
                // PARTIE SIGNATURE - bien positionnée à droite sans chevauchement
                const signatureX = 650;  // Position X de la signature
                const signatureY = 480;  // Position Y de la signature, plus basse pour éviter le chevauchement
                
                // Ligne de signature
                doc.moveTo(signatureX, signatureY)
                   .lineTo(signatureX + 120, signatureY)
                   .lineWidth(1)
                   .stroke();
                
               // Signature
                doc.fontSize(10)
                   .fill('black')
                   .text('Mme.Nadia Mrabi', 450, 450, { align: 'right' });
                
                doc.fontSize(8)
                   .text('Senior Manager CSR & Program', 450, 465, { align: 'right' })
                   .text('Orange Digital Center Maroc', 450, 480, { align: 'right' });
                
                // Image de signature (à remplacer par une véritable image)
                
                doc.end();
    
                stream.on('finish', () => resolve());
                stream.on('error', (err) => reject(err));
    
            } catch (error) {
                reject(error);
            }
        });
    };
   
    
    module.exports = {
        calculerJoursPresenceBeneficiaires,
        genererPDF
    };