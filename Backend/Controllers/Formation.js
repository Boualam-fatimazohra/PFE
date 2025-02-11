
const Formation = require('../Models/formation.model.js');
const { Formateur } = require('../Models/formateur.model.js');
// const AddFormation = async (req, res) => {
//   const {nom, dateDebut, dateFin, lienInscription,tags} = req.body;
//   console.log("debut de fonctionn")
//   const id = req.user?.userId; // Vérification de la présence de req.user
//   const role = req.user?.role;

//   if (!id || role !== "Formateur"){
//     console.log("Accès refusé. Seuls les formateurs peuvent créer une formation.");
//     return res.status(403).json({ message: "Accès refusé. Seuls les formateurs peuvent créer une formation." });
//   }

//   try {
//     const newFormation = new Formation({
//       nom,
//       dateDebut,
//       dateFin,
//       lienInscription,
//       tags,
//       formateur: id,
      
//     });

//     await newFormation.save();

//     res.status(201).json({ message: "Formation créée avec succès", formation: newFormation });
//     console.log("Formation créée avec succès");

//   } catch (error) {
//     console.log("Erreur lors de la création de la formation");

//     res.status(500).json({ message: "Erreur lors de la création de la formation", error: error.message });
//   }
// };
const createFormation = async (req, res) => {
  try {
      // 1. Récupérer l'ID utilisateur depuis les cookies
      const id = req.user?.userId; // Vérification de la présence de req.user
      const role = req.user?.role;  
      if (!id) {
          return res.status(401).json({ message: "Utilisateur non authentifié" });
      }
      if (role !== "Formateur") {
        return res.status(403).json({ message: "Accès refusé. Seuls les formateurs peuvent créer une formation." });
    }
      // 3. Vérifier si un document Formateur existe déjà
      let formateur = await Formateur.findOne({ utilisateur: id });

      // 4. Si le formateur n'existe pas, on le crée
      if (!formateur) {
          formateur = new Formateur({ utilisateur: id, formations: [] });
          await formateur.save();
      }
     
      // 5. Créer la formation avec l'ID du Formateur
      const nouvelleFormation = new Formation({
          nom: req.body.nom,
          dateDebut: req.body.dateDebut,
          dateFin: req.body.dateFin,
          lienInscription: req.body.lienInscription,
          tags: req.body.tags,
          formateur: formateur._id // Lier au Formateur et non à l'Utilisateur
      });

      // 6. Sauvegarder la formation
      const formationEnregistree = await nouvelleFormation.save();

      // 7. Ajouter cette formation à la liste des formations du formateur
      formateur.formations.push(formationEnregistree._id);
      await formateur.save();

      res.status(201).json(formationEnregistree);
  } catch (error) {
      res.status(500).json({ message: "Erreur lors de la création de la formation", error: error.message });
  }
};

////////////////////////////////////////////////////////////////////////////////////////
//Api For Get All Formations

const GetFormations = async (req, res) => {
  try {
    // Populate formateur (et l'utilisateur lié) + classes
    const formations = await Formation.find()
      .populate({ path: 'formateur', populate: { path: 'utilisateur' } });    

    res.status(200).json(formations);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error fetching formations', 
      error: error.message 
    });
  }
};


//Api For Get one Formation Specifier Using Id Of Fomation

const GetOneFormation = async (req, res) => {
  try {
    const { id } = req.params; 

    // Vérifier si l'ID est valide
    if (!id || id.length !== 24) {
      return res.status(400).json({ message: "ID de formation invalide" });
    }

    // Rechercher la formation par ID et peupler les relations
    const formation = await Formation.findById(id)
      .populate({ path: 'formateur', populate: { path: 'utilisateur' } }); // Peupler formateur + utilisateur
    // Vérifier si la formation existe
    if (!formation) {
      return res.status(404).json({ message: "Formation non trouvée" });
    }
    // Retourner la formation trouvée
    res.status(200).json(formation);
  } catch (error) {
    res.status(500).json({ 
      message: "Erreur lors de la récupération de la formation",
      error: error.message 
    });
  }
};


////////////////////////////////////////////////////////////////////////////////////////
//Api For Update a Formation

const UpdateFormation = async (req, res) => {
  const { id } = req.params;
  const { nom, dateDebut, dateFin, lienInscription, tags } = req.body;

  try {
    const updatedFormation = await Formation.findByIdAndUpdate(
      id,
      { nom, dateDebut, dateFin, lienInscription, tags },
      { new: true } 
    );

    if (!updatedFormation) {
      return res.status(404).json({ message: 'Formation non trouvée' });
    }

    res.status(200).json({ message: 'Formation mise à jour avec succès', formation: updatedFormation });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la mise à jour de la formation', error: error.message });
  }
};


////////////////////////////////////////////////////////////////////////////////////////
//Api For Delete a Formtion or Many Formations

const DeleteFormations = async (req, res) => {
  const { ids } = req.body;
  console.log("ids:",ids);
  try {
    const result = await Formation.deleteMany({ _id: { $in: ids } });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'No courses found for the provided IDs.' });
    }

    res.status(200).json({ message: `${result.deletedCount} course(s) deleted successfully` });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting courses', error: error.message });
  }
};
const DeleteFormation = async (req, res) => {
  const { id } = req.params; 
  try {
    const result = await Formation.findByIdAndDelete(id);
    if (!result) {
      return res.status(404).json({ message: 'Formation non trouvée avec l\'ID fourni.' });
    }
    res.status(200).json({ message: 'Formation supprimée avec succès.' });
  } catch (error) {
    res.status(500).json({
      message: 'Erreur lors de la suppression de la formation',
      error: error.message,
    });
  }
};
////////////////////////////////////////////////////////////////////////////////////////
//Api For Get Foramtions Of a Mentor 

const GetFormationOFmentor = async (req, res) => {
  try {
    const mentorId = req.user.userId;
    const courses = await Course.find({ mentors: mentorId }).populate('mentors');
    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching courses', error: error.message });
  }
};


module.exports = { createFormation, GetFormations, GetOneFormation, UpdateFormation, DeleteFormations, GetFormationOFmentor,DeleteFormation };