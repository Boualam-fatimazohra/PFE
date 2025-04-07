const fs = require('fs');
const Beneficiaire = require('../Models/beneficiaire.model');
const Formation = require('../Models/formation.model');
const BeneficiareFormation = require('../Models/beneficiairesFormation.js');
const jwt = require('jsonwebtoken');
const {sendQRCodeByEmail}=require("../utils/qrCodeUtils.js");

// Fonction principale pour générer et envoyer le QR code
const generateAndSendQRCode = async (req, res) => {
    try {
        const { beneficiaireId, formationId } = req.body;
        
        // Vérifier si le bénéficiaire existe
        const beneficiaire = await Beneficiaire.findById(beneficiaireId);
        if (!beneficiaire) {
            return res.status(404).json({ message: 'Bénéficiaire non trouvé' });
        }
        
        // Vérifier si la formation existe
        const formation = await Formation.findById(formationId);
        if (!formation) {
            return res.status(404).json({ message: 'Formation non trouvée' });
        }
        
        // Vérifier si l'association BeneficiareFormation existe déjà
        let beneficiaireFormation = await BeneficiareFormation.findOne({
            beneficiaire: beneficiaireId,
            formation: formationId
        });
        console.log(" fonction generateAndSendQRCode beneficiaire formation recupére",beneficiaireFormation);
        // Si l'association n'existe pas, retourner une erreur
        if (!beneficiaireFormation) {
            return res.status(404).json({ message: 'Beneficiaire Formation non trouvé' });
        }
        
        // Vérifier que JWT_SECRET est défini
        if (!process.env.JWT_SECRET) {
            console.error("JWT_SECRET n'est pas défini dans les variables d'environnement !");
            return res.status(500).json({ message: 'Erreur de configuration du serveur' });
        }
        
        // Créer un token JWT contenant les informations du bénéficiaire et de la formation
        const qrCodeToken = jwt.sign(
            {
                beneficiaireId: beneficiaireFormation.beneficiaire,
                formationId: beneficiaireFormation.formation,
                associationId: beneficiaireFormation._id
            },
            process.env.JWT_SECRET,
            { expiresIn: '7d' } // Expiration après 7 jours
        );
        console.log("voici le token qui sera met dans le qr code ",qrCodeToken);
        // Sauvegarder le token dans un champ temporaire de l'association
        beneficiaireFormation.qrCodeToken = qrCodeToken;
        await beneficiaireFormation.save();
        
        // Envoyer le QR code par email
        await sendQRCodeByEmail(beneficiaire, formation, qrCodeToken);
        
        res.status(200).json({ 
            success: true,
            message: 'QR Code généré et envoyé avec succès',
            beneficiaire: beneficiaire.email
        });
    } catch (error) {
        console.error('Erreur lors de la génération et l\'envoi du QR code:', error);
        res.status(500).json({ 
            success: false,
            message: 'Erreur serveur', 
            error: error.message 
        });
    }
};
const verifyQRCode = async (req, res) => {
    try {
        const { token } = req.body;
        
        // Vérifier que JWT_SECRET est défini
        if (!process.env.JWT_SECRET) {
            console.error("JWT_SECRET n'est pas défini dans les variables d'environnement !");
            return res.status(500).json({ message: 'Erreur de configuration du serveur' });
        }
        
        // Décoder le token JWT
        let decoded;
        try {
            decoded = jwt.verify(token,process.env.JWT_SECRET);
        } catch (error) {
            if (error.name === 'TokenExpiredError') {
                return res.status(401).json({ 
                    success: false, 
                    message: 'Le QR Code a expiré' 
                });
            }
            return res.status(401).json({ 
                success: false, 
                message: 'QR Code invalide' 
            });
        }
        
        const { beneficiaireId, formationId, associationId } = decoded;
        
        // Récupérer l'instance de BeneficiareFormation
        const beneficiaireFormation = await BeneficiareFormation.findById(associationId);
        if (!beneficiaireFormation) {
            return res.status(404).json({ 
                success: false, 
                message: 'Association bénéficiaire-formation non trouvée' 
            });
        }
        
        // Vérifier que le token correspond bien à celui stocké
        if (beneficiaireFormation.qrCodeToken !== token) {
            return res.status(401).json({ 
                success: false, 
                message: 'QR Code invalide ou révoqué' 
            });
        }
        
        // Vérifier les confirmations email et téléphone
        if (beneficiaireFormation.confirmationEmail && beneficiaireFormation.confirmationAppel) {
            // Récupérer les informations du bénéficiaire et de la formation pour la réponse
            const beneficiaire = await Beneficiaire.findById(beneficiaireId);
            const formation = await Formation.findById(formationId);
            
            return res.status(200).json({
                success: true,
                message: 'QR Code valide - Bénéficiaire confirmé',
                data: {
                    beneficiaire: {
                        id: beneficiaire._id,
                        nom: beneficiaire.nom,
                        prenom: beneficiaire.prenom,
                        email: beneficiaire.email
                    },
                    formation: {
                        id: formation._id,
                        titre: formation.titre,
                        date: formation.date
                    }
                }
            });
        } else {
            // Construire un message détaillé sur les confirmations manquantes
            let statut = 'incomplet';
            let message = 'Confirmations manquantes: ';
            let confirmationsManquantes = [];
            
            if (!beneficiaireFormation.confirmationEmail) {
                confirmationsManquantes.push('email');
            }
            
            if (!beneficiaireFormation.confirmationAppel) {
                confirmationsManquantes.push('téléphone');
            }
            
            message += confirmationsManquantes.join(' et ');
            
            return res.status(200).json({
                success: false,
                statut,
                message,
                confirmationEmail: beneficiaireFormation.confirmationEmail,
                confirmationTelephone: beneficiaireFormation.confirmationTelephone
            });
        }
    } catch (error) {
        console.error('Erreur lors de la vérification du QR code:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur serveur',
            error: error.message
        });
    }
};

module.exports = { 
    generateAndSendQRCode,
    sendQRCodeByEmail,
    verifyQRCode
};