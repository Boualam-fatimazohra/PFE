
const Formation = require('../Models/formation.model.js');
const AddFormation = async (req, res) => {
  const {nom, dateDebut, dateFin, lienInscription,tags} = req.body;
  console.log("debut de fonctionn")
  const id = req.user?.userId; // Vérification de la présence de req.user
  const role = req.user?.role;

  if (!id || role !== "Formateur"){
    console.log("Accès refusé. Seuls les formateurs peuvent créer une formation.");
    return res.status(403).json({ message: "Accès refusé. Seuls les formateurs peuvent créer une formation." });
  }

  try {
    const newFormation = new Formation({
      nom,
      dateDebut,
      dateFin,
      lienInscription,
      tags,
      formateur: id,
      
    });

    await newFormation.save();

    res.status(201).json({ message: "Formation créée avec succès", formation: newFormation });
    console.log("Formation créée avec succès");

  } catch (error) {
    console.log("Erreur lors de la création de la formation");

    res.status(500).json({ message: "Erreur lors de la création de la formation", error: error.message });
  }
};


////////////////////////////////////////////////////////////////////////////////////////
//Api For Get All Formations

const GetFormations = async (req, res) => {
  try {
    const courses = await Course.find().populate('mentors');  // Use the Course model
    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching courses', error: error.message });
  }
};

////////////////////////////////////////////////////////////////////////////////////////
//Api For Get one Formation Specifier Using Id Of Fomation

const GetOneFormations = async (req, res) => {
  const { id } = req.params;
  try {
    const course = await Course.findById(id).populate('mentors'); // Use Course model
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.status(200).json(course);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching course', error: error.message });
  }
};

////////////////////////////////////////////////////////////////////////////////////////
//Api For Update a Formation

const UpdateFormations = async (req, res) => {
  const { id } = req.params;
  const { title, description, startDate, endDate, type, mentors, tags } = req.body;

  try {
    const updatedCourse = await Course.findByIdAndUpdate(
      id,
      { title, description, startDate, endDate, type, mentors, tags },
      { new: true } // Return the updated document
    );

    if (!updatedCourse) {
      return res.status(404).json({ message: 'Course not found' });
    }

    res.status(200).json({ message: 'Course updated successfully', course: updatedCourse });
  } catch (error) {
    res.status(500).json({ message: 'Error updating course', error: error.message });
  }
};

////////////////////////////////////////////////////////////////////////////////////////
//Api For Delete a Formtion or Many Formations

const DeleteFormations = async (req, res) => {
  const { ids } = req.body;

  console.log("ids:",ids)

  try {
    const result = await Course.deleteMany({ _id: { $in: ids } });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'No courses found for the provided IDs.' });
    }

    res.status(200).json({ message: `${result.deletedCount} course(s) deleted successfully` });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting courses', error: error.message });
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


module.exports = { AddFormation, GetFormations, GetOneFormations, UpdateFormations, DeleteFormations, GetFormationOFmentor };