// Importation des modèles nécessaires
const Formateur = require('../Models/formateur.model');
const Coordinateur = require('../Models/coordinateur.model');
const Manager = require('../Models/manager.model');

// Assurez-vous d'importer les fonctions de récupération si elles ne sont pas définies ici
const getFormateurs = async () => {
    return await Formateur.find().populate("utilisateur", "nom prenom email numeroTelephone role");
};

const getAllCoordinateurs = async () => {
    return await Coordinateur.find().populate("utilisateur", "nom prenom email numeroTelephone role");
};

const getManagers = async () => {
    return await Manager.find().populate("utilisateur", "nom prenom email numeroTelephone role");
};

// Contrôleur pour calculer le total des utilisateurs
const TotalUtilisateursController = {
    getTotalUtilisateursAvecDetails: async (req, res) => {
        try {
            // Récupération des données
            const formateurs = await getFormateurs();
            const coordinateurs = await getAllCoordinateurs();
            const managers = await getManagers();

            // Vérification des données
            const formateursList = Array.isArray(formateurs) ? formateurs : [];
            const coordinateursList = Array.isArray(coordinateurs) ? coordinateurs : [];
            const managersList = Array.isArray(managers) ? managers : [];

            // Construction du résultat
            const totalUtilisateurs = {
                nombreFormateurs: formateursList.length,
                nombreCoordinateurs: coordinateursList.length,
                nombreManagers: managersList.length,
                total: formateursList.length + coordinateursList.length + managersList.length,
                utilisateursDetails: [
                    ...formateursList.map(f => ({
                        type: 'formateur',
                        id: f._id,
                        nomComplet: f.utilisateur ? `${f.utilisateur.nom} ${f.utilisateur.prenom}` : 'Inconnu',
                        nom: f.utilisateur?.nom || '',
                        prenom: f.utilisateur?.prenom || '',
                        email: f.utilisateur?.email || '',
                        telephone: f.utilisateur?.numeroTelephone || ''
                    })),
                    ...coordinateursList.map(c => ({
                        type: 'coordinateur',
                        id: c._id,
                        nomComplet: c.utilisateur ? `${c.utilisateur.nom} ${c.utilisateur.prenom}` : 'Inconnu',
                        nom: c.utilisateur?.nom || '',
                        prenom: c.utilisateur?.prenom || '',
                        email: c.utilisateur?.email || '',
                        telephone: c.utilisateur?.numeroTelephone || ''
                    })),
                    ...managersList.map(m => ({
                        type: 'manager',
                        id: m._id,
                        nomComplet: m.utilisateur ? `${m.utilisateur.nom} ${m.utilisateur.prenom}` : 'Inconnu',
                        nom: m.utilisateur?.nom || '',
                        prenom: m.utilisateur?.prenom || '',
                        email: m.utilisateur?.email || '',
                        telephone: m.utilisateur?.numeroTelephone || ''
                    }))
                ]
            };

            res.status(200).json(totalUtilisateurs);
        } catch (error) {
            res.status(500).json({
                message: "Erreur lors du calcul du total des utilisateurs",
                error: error.message
            });
        }
    },

    getParticipantOptions: async (req, res) => {
        try {
            // Récupération des utilisateurs détaillés
            const mockRes = {
                status: () => ({ json: (data) => data })
            };
            const result = await TotalUtilisateursController.getTotalUtilisateursAvecDetails(req, mockRes);

            // Vérification de la validité des données reçues
            if (!result || !result.utilisateursDetails) {
                return res.status(500).json({ message: "Impossible de récupérer les participants" });
            }

            // Transformation des données en format option pour select
            const options = result.utilisateursDetails.map(user => ({
                label: user.nomComplet,
                value: user.id,
                nom: user.nom,
                prenom: user.prenom,
                type: user.type
            }));

            res.status(200).json(options);
        } catch (error) {
            res.status(500).json({
                message: "Erreur lors de la récupération des options",
                error: error.message
            });
        }
    }
};

module.exports = TotalUtilisateursController;
