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

// In api/services/api.js or wherever your addFormation function is defined
const API_BASE_URL = import.meta.env.MODE==="development"?import.meta.env.VITE_API_LINK || 'http://localhost:5000':'';

export const addFormation = async (formData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/formation/Addformation`, {
      method: 'POST',
      body: formData, // Don't set Content-Type header for multipart/form-data
      credentials: 'include'
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to add formation');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error adding formation:', error);
    throw error;
  }
};
