
const Formation = require('../Models/formation.model.js');
const { Formateur } = require('../Models/formateur.model.js');
//  debut : creation d'un formation par un formateur bien précis :
const createFormation = async (req, res) => {
  try {
      // 1. Récupérer l'ID utilisateur depuis les cookies
      const id = req.user?.userId; // Vérification de la présence de req.user
      const role = req.user?.role;  
      if (!id) {
          return res.status(401).json({ message:"Utilisateur non authentifié" });
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
      const nouvelleFormation = new Formation({
          nom: req.body.nom,
          dateDebut: req.body.dateDebut,
          dateFin: req.body.dateFin,
          lienInscription: req.body.lienInscription,
          tags: req.body.tags,
          formateur: formateur._id 
      });
      const formationEnregistree = await nouvelleFormation.save();
      res.status(201).json(formationEnregistree);
  } catch (error) {
      res.status(500).json({ message: "Erreur lors de la création de la formation", error: error.message });
  }
};
// fin : creation d'un formation par un formateur bien précis
// debut : recupération de tout les formations de tous les formateurs
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
// fin : recupération de tout les formations de tous les formateurs
// debut :récupérer une formation par id passé en paramétre 
const GetOneFormation = async (req, res) => {
  try {
    const { id } = req.params; 
    if (!id || id.length !== 24) {
      return res.status(400).json({ message: "ID de formation invalide" });
    };
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
// fin: récupérer une formation par id passé en paramétre 
// todo => debut : modifier une formation 
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
// fin : modifier une formation
// debut : deleteFormation par id 
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
// fin  : deleteFormation par id 
// debut : récupérer les formation d'un seule formateur 
const GetFormationOfMentor = async (req, res) => {
  try {
    const mentorId = req.user.userId;
    console.log(req.user.userId);
    const formations = await Formation.find({ formateur: mentorId })
.populate('formateur');
    res.status(200).json(formations);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching formations', error: error.message });
  }
};
// fin:récupérer les formations d'un seule formateur
module.exports = { createFormation, GetFormations, GetOneFormation, UpdateFormation,GetFormationOfMentor,DeleteFormation };