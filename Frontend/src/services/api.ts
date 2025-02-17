import axios from "axios";

interface Formation {
  _id?: string;
  nom: string;
  dateDebut: string;
  dateFin: string;
  lienInscription: string;
  tags: string;
  status?: "En Cours" | "Terminer" | "Replanifier";
}
const API_URL = 'http://localhost:5000/api/formation/GetFormations';

const ADD_URL = 'http://localhost:5000/api/formation/Addformation';

// Helper function to get the token from cookies
const getToken = () => {
  return document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1];
};

// Create axios instance with default config
const api = axios.create({
  withCredentials: true // This is important for cookies
});

export const fetchFormations = async (): Promise<Formation[]> => {
  try {
    const response = await api.get(API_URL);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des formations:', error);
    throw error;
  }
};

export const addFormation = async (formationData: Formation): Promise<Formation> => {
  try {
    const response = await api.post(ADD_URL, formationData, {
      withCredentials: true, // 🔥 Active l'envoi des cookies avec la requête
      headers: {
        'Content-Type': 'application/json'
      }
    });

    return response.data;
  } catch (error) {
    console.error("Erreur lors de l'ajout de la formation", error);
    
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      throw new Error('Veuillez vous connecter pour ajouter une formation');
    }
    
    throw error;
  }
};
