const ProjetFab = require('../Models/projetFab.model');
const FormationBase = require('../Models/formationBase.model');
const EncadrantFormation = require('../Models/encadrantFormation.model');
const mongoose = require('mongoose');

// Contrôleur pour les opérations CRUD de ProjetFab
const projetFabController = {
    // Créer un nouveau projet de fabrication avec transaction
    create: async (req, res) => {
        const session = await mongoose.startSession();
        session.startTransaction();
      
        try {
          const {
            // Base formation fields
            nom,
            dateDebut,
            dateFin,
            description,
            
            // ProjetFab specific fields
            status,
            progress,
            nombreParticipants,
            
            // Encadrants IDs (peut être un seul ID ou un tableau)
            encadrantIds
          } = req.body;
          
          // Validate required fields
          if (!nom || !dateDebut || !dateFin) {
            return res.status(400).json({ message: "Le nom, dateDebut, dateFin du projet sont obligatoires" });
          }
          
          // Convertir encadrantIds en tableau si ce n'est pas déjà le cas
          const encadrantsArray = encadrantIds 
            ? Array.isArray(encadrantIds) ? encadrantIds : [encadrantIds]
            : [];
          
          // Valider qu'on ne dépasse pas 3 encadrants
          if (encadrantsArray.length > 3) {
            return res.status(400).json({ message: "Vous ne pouvez assigner que 3 encadrants maximum" });
          }
          
          // Récupérer l'URL de l'image depuis le fichier téléchargé par multer
          const imageUrl = req.file ? req.file.path : null;
          
          // 1. Create the base formation
          const formationBase = new FormationBase({
            nom,
            dateDebut: dateDebut,
            dateFin: dateFin,
            description: description || "Aucune description",
            image: imageUrl
          });
          
          const savedBaseFormation = await formationBase.save({ session });
          
          // 2. Create the ProjetFab that references the base
          const projetFab = new ProjetFab({
            baseFormation: savedBaseFormation._id,
            status: status || "Avenir",
            progress: progress || 0,
            nombreParticipants: nombreParticipants || 0
          });
          
          const savedProjetFab = await projetFab.save({ session });
          
          // 3. Create encadrant assignments if provided
          const encadrantAssignments = [];
          
          for (const encadrantId of encadrantsArray) {
            // Validate encadrant ID
            if (!mongoose.Types.ObjectId.isValid(encadrantId)) {
              return res.status(400).json({ message: `Format d'ID d'encadrant invalide: ${encadrantId}` });
            }
            
            // Create the assignment
            const assignment = new EncadrantFormation({
              encadrant: encadrantId,
              formationBase: savedBaseFormation._id,
              dateAssignment: new Date()
            });
            
            await assignment.save({ session });
            encadrantAssignments.push(assignment);
          }
          
          // Commit the transaction
          await session.commitTransaction();
          session.endSession();
          
          // Fetch fully populated result for response
          const result = await ProjetFab.findById(savedProjetFab._id)
            .populate('baseFormation');
          
          // Fetch associated encadrants
          const populatedEncadrants = await EncadrantFormation.find({
            formationBase: savedBaseFormation._id
          })
          .populate({
            path: 'encadrant',
            populate: {
              path: 'utilisateur',
              select: 'nom prenom email'
            }
          });
          
          res.status(201).json({
            success: true,
            message: "Projet de fabrication créé avec succès",
            data: {
              projetFab: result,
              encadrants: populatedEncadrants.map(e => ({
                _id: e._id,
                encadrant: e.encadrant,
                dateAssignment: e.dateAssignment
              }))
            }
          });
        } catch (error) {
          // Abort transaction in case of error
          await session.abortTransaction();
          session.endSession();
          
          console.error("Error creating projet fab:", error);
          
          if (error.code === 11000) {
            return res.status(400).json({
              success: false,
              message: "Un projet existe déjà pour cette formation de base"
            });
          }
          
          return res.status(500).json({
            success: false,
            message: "Erreur lors de la création du projet",
            error: error.message
          });
        }
      },
  
    // Récupérer tous les projets de fabrication
    // Récupérer tous les projets de fabrication avec leurs encadrants
// Récupérer tous les projets de fabrication avec leurs encadrants
getAll: async (req, res) => {
    try {
      // Récupérer tous les projets avec la formation de base
      const projets = await ProjetFab.find()
        .populate({
          path: 'baseFormation',
          select: 'nom dateDebut dateFin description image'
        })
        .sort({ createdAt: -1 });
      
      console.log(`Nombre de projets trouvés: ${projets.length}`);
      
      // Pour chaque projet, récupérer les encadrants via EncadrantFormation
      const projetsAvecEncadrants = await Promise.all(
        projets.map(async (projet) => {
          console.log(`Recherche d'encadrants pour la formation: ${projet.baseFormation._id}`);
          
          const encadrants = await EncadrantFormation.find({
            formationBase: projet.baseFormation._id
          })
          .populate({
            path: 'encadrant',
            populate: {
              path: 'utilisateur',
              select: 'nom prenom email'
            }
          });
          
          console.log(`Nombre d'encadrants trouvés pour ${projet.baseFormation.nom}: ${encadrants.length}`);
          if (encadrants.length === 0) {
            // Vérifiez si des encadrants existent dans la collection
            const totalCount = await EncadrantFormation.countDocuments();
            console.log(`Total des encadrants dans la base: ${totalCount}`);
          }
          
          return {
            ...projet.toObject(),
            encadrants: encadrants.map(e => ({
              _id: e._id,
              encadrant: e.encadrant,
              dateAssignment: e.dateAssignment
            }))
          };
        })
      );
      
      return res.status(200).json({
        success: true,
        count: projetsAvecEncadrants.length,
        data: projetsAvecEncadrants
      });
    } catch (error) {
      console.error("Error fetching projects:", error);
      return res.status(500).json({
        success: false,
        message: "Erreur lors de la récupération des projets",
        error: error.message
      });
    }
  },
  
    // Récupérer un projet de fabrication par son ID
    // Récupérer un projet de fabrication spécifique avec ses encadrants
getById: async (req, res) => {
    try {
      const projetId = req.params.id;
      
      // Vérifier si l'ID est valide
      if (!mongoose.Types.ObjectId.isValid(projetId)) {
        return res.status(400).json({
          success: false,
          message: "Format d'ID de projet invalide"
        });
      }
      
      // Récupérer le projet avec la formation de base
      const projet = await ProjetFab.findById(projetId)
        .populate({
          path: 'baseFormation',
          select: 'nom dateDebut dateFin description image'
        });
      
      // Vérifier si le projet existe
      if (!projet) {
        return res.status(404).json({
          success: false,
          message: "Projet de fabrication non trouvé"
        });
      }
      
      // Récupérer les encadrants associés à ce projet via EncadrantFormation
      const encadrants = await EncadrantFormation.find({
        formationBase: projet.baseFormation._id
      })
      .populate({
        path: 'encadrant',
        populate: {
          path: 'utilisateur',
          select: 'nom prenom email'
        }
      });
      
      // Construire l'objet de réponse avec le projet et ses encadrants
      const projetAvecEncadrants = {
        ...projet.toObject(),
        encadrants: encadrants.map(e => ({
          _id: e._id,
          encadrant: e.encadrant,
          dateAssignment: e.dateAssignment
        }))
      };
      
      return res.status(200).json({
        success: true,
        data: projetAvecEncadrants
      });
    } catch (error) {
      console.error("Error fetching project:", error);
      return res.status(500).json({
        success: false,
        message: "Erreur lors de la récupération du projet",
        error: error.message
      });
    }
  },
  
    // Mettre à jour un projet de fabrication
    update: async (req, res) => {
      try {
        // Vérifier si baseFormation a été modifié et s'il existe
        if (req.body.baseFormation) {
          const formationBaseExists = await FormationBase.findById(req.body.baseFormation);
          if (!formationBaseExists) {
            return res.status(404).json({
              success: false,
              message: "Formation de base non trouvée"
            });
          }
        }
  
        const updatedProjet = await ProjetFab.findByIdAndUpdate(
          req.params.id,
          { $set: req.body },
          { new: true, runValidators: true }
        ).populate('baseFormation');
  
        if (!updatedProjet) {
          return res.status(404).json({
            success: false,
            message: "Projet non trouvé"
          });
        }
  
        return res.status(200).json({
          success: true,
          message: "Projet mis à jour avec succès",
          data: updatedProjet
        });
      } catch (error) {
        if (error.code === 11000) {
          return res.status(400).json({
            success: false,
            message: "Un projet existe déjà pour cette formation de base"
          });
        }
        if (error instanceof mongoose.Error.CastError) {
          return res.status(400).json({
            success: false,
            message: "ID de projet invalide"
          });
        }
        return res.status(500).json({
          success: false,
          message: "Erreur lors de la mise à jour du projet",
          error: error.message
        });
      }
    },
  
    // Supprimer un projet de fabrication
    delete: async (req, res) => {
      try {
        const deletedProjet = await ProjetFab.findByIdAndDelete(req.params.id);
        
        if (!deletedProjet) {
          return res.status(404).json({
            success: false,
            message: "Projet non trouvé"
          });
        }
  
        return res.status(200).json({
          success: true,
          message: "Projet supprimé avec succès"
        });
      } catch (error) {
        if (error instanceof mongoose.Error.CastError) {
          return res.status(400).json({
            success: false,
            message: "ID de projet invalide"
          });
        }
        return res.status(500).json({
          success: false,
          message: "Erreur lors de la suppression du projet",
          error: error.message
        });
      }
    },
  
    // Récupérer les projets par statut
    getByStatus: async (req, res) => {
      try {
        const { status } = req.params;
        const validStatuses = ["En Cours", "Terminé", "Avenir", "Replanifier"];
        
        if (!validStatuses.includes(status)) {
          return res.status(400).json({
            success: false,
            message: "Statut invalide. Statuts valides: En Cours, Terminé, Avenir, Replanifier"
          });
        }
  
        const projets = await ProjetFab.find({ status })
          .populate('baseFormation')
          .sort({ createdAt: -1 });
        
        return res.status(200).json({
          success: true,
          count: projets.length,
          data: projets
        });
      } catch (error) {
        return res.status(500).json({
          success: false,
          message: "Erreur lors de la récupération des projets",
          error: error.message
        });
      }
    },
  
    // Mettre à jour le statut d'un projet
    updateStatus: async (req, res) => {
      try {
        const { status } = req.body;
        const validStatuses = ["En Cours", "Terminé", "Avenir", "Replanifier"];
        
        if (!status || !validStatuses.includes(status)) {
          return res.status(400).json({
            success: false,
            message: "Statut invalide. Statuts valides: En Cours, Terminé, Avenir, Replanifier"
          });
        }
  
        const updatedProjet = await ProjetFab.findByIdAndUpdate(
          req.params.id,
          { status },
          { new: true, runValidators: true }
        ).populate('baseFormation');
  
        if (!updatedProjet) {
          return res.status(404).json({
            success: false,
            message: "Projet non trouvé"
          });
        }
  
        return res.status(200).json({
          success: true,
          message: "Statut du projet mis à jour avec succès",
          data: updatedProjet
        });
      } catch (error) {
        if (error instanceof mongoose.Error.CastError) {
          return res.status(400).json({
            success: false,
            message: "ID de projet invalide"
          });
        }
        return res.status(500).json({
          success: false,
          message: "Erreur lors de la mise à jour du statut",
          error: error.message
        });
      }
    },
  
    // Mettre à jour la progression d'un projet
    updateProgress: async (req, res) => {
      try {
        const { progress } = req.body;
        
        if (progress === undefined || progress < 0 || progress > 100) {
          return res.status(400).json({
            success: false,
            message: "La progression doit être un nombre entre 0 et 100"
          });
        }
  
        const updatedProjet = await ProjetFab.findByIdAndUpdate(
          req.params.id,
          { progress },
          { new: true, runValidators: true }
        ).populate('baseFormation');
  
        if (!updatedProjet) {
          return res.status(404).json({
            success: false,
            message: "Projet non trouvé"
          });
        }
  
        return res.status(200).json({
          success: true,
          message: "Progression du projet mise à jour avec succès",
          data: updatedProjet
        });
      } catch (error) {
        if (error instanceof mongoose.Error.CastError) {
          return res.status(400).json({
            success: false,
            message: "ID de projet invalide"
          });
        }
        return res.status(500).json({
          success: false,
          message: "Erreur lors de la mise à jour de la progression",
          error: error.message
        });
      }
    }
  };

module.exports = projetFabController;