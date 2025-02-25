import { useState, useEffect } from "react";
import { getAllFormations } from "../../api/services/formationService";

const FormateurFormations = () => {
  const [formations, setFormations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFormations = async () => {
      try {
        const data = await getAllFormations();
        setFormations(data);
      } catch (err) {
        setError("Failed to load formations.");
      } finally {
        setLoading(false);
      }
    };

    fetchFormations();
  }, []);

  return (
    <div className="container">
      <h2>My Created Formations</h2>

      {loading && <p>Loading formations...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <ul>
        {formations.map((formation: any) => (
          <li key={formation._id}>
            <h3>{formation.nom}</h3>
            <p><strong>Start Date:</strong> {formation.dateDebut}</p>
            <p><strong>End Date:</strong> {formation.dateFin}</p>
            <p><strong>Status:</strong> {formation.status}</p>
            <p><strong>Tags:</strong> {formation.tags}</p>
            <a href={formation.lienInscription} target="_blank" rel="noopener noreferrer">Register</a>
            {formation.image && <img src={formation.image} alt="Formation" width="100" />}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FormateurFormations;
