import { useState } from "react";
import { useFormations } from "../../contexts/FormationContext";

const FormateurFormations = () => {
  const { formations, loading, error } = useFormations();
  
  return (
    <div className="container">
      <h2>My Created Formations</h2>
      
      {loading && <p>Loading formations...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      
      <ul>
        {formations.map((formation) => (
          <li key={formation._id}>
            <h3>{formation.nom}</h3>
            <p><strong>Start Date:</strong> {formation.dateDebut}</p>
            <p><strong>End Date:</strong> {formation.dateFin}</p>
            <p><strong>Status:</strong> {formation.status}</p>
            <p><strong>Tags:</strong> {formation.tags}</p>
            <a href={formation.lienInscription} target="_blank" rel="noopener noreferrer">Register</a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FormateurFormations;
