import axios from "axios";

interface Formation {
  _id: string;
  nom: string;
  dateDebut: string;
  dateFin: string;
  status: string;
}
const API_URL = 'http://localhost:5000/api/formation/GetFormations';
export const fetchFormations = async (): Promise<Formation[]> => {
    try {
      const response = await axios.get(API_URL); 
      return response.data; 
    } catch (error) {
      console.error('Erreur lors de la récupération des formations:', error);
      throw error; // Propager l'erreur pour gestion ultérieure
}
};