const mongoose = require('mongoose');

const authorizeFormationAccess = (accessType) => {
    return async (req, res, next) => {
        try {
            const { userId, role } = req.user;

            // Admin bypass
            if (role === "Admin") {
                return next();
            }

            const Formation = mongoose.models.Formation;
            const Formateur = mongoose.models.Formateur;
            
            if (!req.params.id) {
                return next();
            }

            // Get formation and populate the complete chain
            const formation = await Formation.findById(req.params.id)
                .populate({
                    path: 'formateur',
                    populate: [
                        {
                            path: 'utilisateur'
                        },
                        {
                            path: 'manager'
                        }
                    ]
                });

            console.log('Formation found:', {
                id: formation?._id,
                formateurId: formation?.formateur?._id,
                formateurUtilisateurId: formation?.formateur?.utilisateur?._id,
                formateurManagerId: formation?.formateur?.manager?._id,
                requestingUserId: userId,
                requestingRole: role
            });

            if (!formation) {
                return res.status(404).json({ message: 'Formation not found' });
            }

            if (!formation.formateur) {
                return res.status(404).json({ message: 'Formateur not found for this formation' });
            }

            // If user is the formateur of the formation
            if (role === 'Formateur') {
                const isFormateur = formation.formateur.utilisateur._id.toString() === userId;
                
                if (!isFormateur) {
                    return res.status(403).json({ 
                        message: 'Forbidden: You are not the formateur of this formation' 
                    });
                }

                // Formateurs cannot delete formations
                if (accessType === 'delete') {
                    return res.status(403).json({ 
                        message: 'Forbidden: Formateurs cannot delete formations' 
                    });
                }
                return next();
            }

            // If user is a manager, check if they are the manager of the formation's formateur
            if (role === 'Manager') {
                const isFormateurManager = formation.formateur.manager.utilisateur.toString() === userId;
                
                if (!isFormateurManager) {
                    return res.status(403).json({ 
                        message: 'Forbidden: You are not the manager of this formation\'s formateur' 
                    });
                }
                return next();
            }

            return res.status(403).json({ 
                message: 'Forbidden: You do not have permission to access this formation'
            });

        } catch (error) {
            console.error("Authorization error:", error);
            console.error("Error stack:", error.stack);
            res.status(500).json({ 
                message: "Internal server error",
                error: error.message
            });
        }
    };
};

module.exports = authorizeFormationAccess;