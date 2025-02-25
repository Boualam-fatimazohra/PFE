import { useState } from "react";
import { createFormation } from "../../api/services/formationService"; // Import API function

const FormateurFormations = () => {
  const [formation, setFormation] = useState({
    nom: "",
    dateDebut: "",
    dateFin: "",
    lienInscription: "",
    tags: "",
    status: "En Cours",
    image: null as File | null, // For file upload
  });

  const [message, setMessage] = useState<string | null>(null);

  // Handle form changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormation({ ...formation, [e.target.name]: e.target.value });
  };

  // Handle file upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormation({ ...formation, image: e.target.files[0] });
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createFormation(formation);
      setMessage("Formation created successfully!");
      setFormation({
        nom: "",
        dateDebut: "",
        dateFin: "",
        lienInscription: "",
        tags: "",
        status: "En Cours",
        image: null,
      });
    } catch (error) {
      setMessage("Error creating formation. Please try again.");
    }
  };

  return (
    <div className="container">
      <h2>Create a New Formation</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <input type="text" name="nom" placeholder="Formation Name" value={formation.nom} onChange={handleChange} required />
        <input type="date" name="dateDebut" value={formation.dateDebut} onChange={handleChange} required />
        <input type="date" name="dateFin" value={formation.dateFin} onChange={handleChange} required />
        <input type="url" name="lienInscription" placeholder="Registration Link" value={formation.lienInscription} onChange={handleChange} required />
        <input type="text" name="tags" placeholder="Tags" value={formation.tags} onChange={handleChange} />
        <select name="status" value={formation.status} onChange={handleChange}>
          <option value="En Cours">En Cours</option>
          <option value="Terminer">Terminer</option>
          <option value="Replanifier">Replanifier</option>
        </select>
        <input type="file" name="image" accept="image/*" onChange={handleFileChange} />
        <button type="submit">Create Formation</button>
      </form>
    </div>
  );
};

export default FormateurFormations;
