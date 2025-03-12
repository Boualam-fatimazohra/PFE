/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';
import apiClient from './apiClient';

interface Formation {
  nom: string;
  dateDebut: string;
  dateFin: string;
  description?: string;
  lienInscription: string;
  status?: string;
  tags?: string;
  categorie?: string;
  niveau?: string;
  image?: File | string; // Allow both File (for uploads) and string (for URLs)
}

export const getBeneficiaireFormation = async (id: string) => {
  try {
    const response = await apiClient.get(`beneficiaires/getBeneficiaireByFormation/${id}`);
    return response.data;
  } catch (error) {
    // Gestion spécifique du cas "Aucun bénéficiaire"
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      if (error.response.data.message.includes("Aucun bénéficiaire trouvé")) {
        return []; // Retourne un tableau vide
      }
    }
    
    // Gestion des autres erreurs
    console.error("Erreur critique :", error);
    throw new Error(
      error.response?.data?.message || 
      "Erreur lors de la récupération des bénéficiaires"
    );
  }
};
export const getAllFormations = async () => {
  try {
    const response = await apiClient.get('/formation/getFormations');
    return response.data;
  } catch (error) {
    console.error('Error fetching formations:', error);
    throw error;
  }
};
export const getNbrBeneficiairesParFormateur=async ()=>{
  try {
    const response = await apiClient.get('/beneficiaires/getNbrBeneficiairesParFormateur');
    return response.data;
  }
  catch(error){
    console.error('Error fetching formations:', error);
    throw error;

  }}

export const getFormationById = async (id: string) => {
  try {
    const response = await apiClient.get(`/formation/GetOneFormation/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching formation ${id}:`, error);
    throw error;
  }
};

// In formationService.ts
export const createFormation = async (formationData: any) => {
  try {
    const formData = new FormData();
    
    // Append all form fields to FormData
    Object.keys(formationData).forEach(key => {
      // Skip image - we'll handle it separately
      if (key !== 'image' && formationData[key] !== null && formationData[key] !== undefined) {
        formData.append(key, formationData[key]);
      }
    });
    
    // Append image if it exists and is a File
    if (formationData.image && formationData.image instanceof File) {
      formData.append('image', formationData.image);
    }
    
    const response = await apiClient.post('/formation/Addformation', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Error creating formation:', error);
    throw error;
  }
};

export const updateFormation = async (id: string, formationData: Partial<Formation>) => {
  try {
    // Check if there's an image file in the update data
    if (formationData.image instanceof File) {
      // Create FormData to handle file upload
      const formData = new FormData();
      
      // Append all fields to FormData
      Object.entries(formationData).forEach(([key, value]) => {
        if (key === 'image' && value instanceof File) {
          formData.append('image', value);
        } else if (value !== undefined) {
          formData.append(key, String(value));
        }
      });
      
      const response = await apiClient.put(`/formation/UpdateFormation/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      return response.data;
    } else {
      // Regular JSON update if no file is involved
      const response = await apiClient.put(`/formation/UpdateFormation/${id}`, formationData);
      return response.data;
    }
  } catch (error) {
    console.error(`Error updating formation ${id}:`, error);
    throw error;
  }
};

export const deleteFormation = async (id: string) => {
  try {
    const response = await apiClient.delete(`/formation/DeleteFormation/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting formation ${id}:`, error);
    throw error;
  }
};
export const createFormationDraft = async (formationData: any) => {
  try {
    const formData = new FormData();
    
    // Append all form fields to FormData
    Object.keys(formationData).forEach(key => {
      // Skip image - we'll handle it separately
      if (key !== 'image' && formationData[key] !== null && formationData[key] !== undefined) {
        formData.append(key, formationData[key]);
      }
    });
    
    // Append image if it exists and is a File
    if (formationData.image && formationData.image instanceof File) {
      formData.append('image', formationData.image);
    }
    
    const response = await apiClient.post('/formation/createFormationDraft', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    
    return response.data;
  } catch (error) {
    // Gestion différenciée des erreurs selon leur type
    if (axios.isAxiosError(error)) {
      // Erreur Axios - nous pouvons accéder à error.response
      const status = error.response?.status || 500;
      
      // Erreurs spécifiques selon le code d'erreur
      if (status === 401) {
        console.error('Erreur d\'authentification:', error.response?.data?.message || 'Utilisateur non authentifié');
        throw new Error('Vous devez être connecté pour créer une formation en brouillon');
      } else if (status === 400) {
        console.error('Données invalides:', error.response?.data?.message);
        throw new Error(error.response?.data?.message || 'Veuillez remplir tous les champs obligatoires');
      } else {
        console.error('Erreur serveur:', error.response?.data);
        throw new Error(error.response?.data?.message || 'Une erreur est survenue lors de la création de la formation');
      }
    } else {
      // Erreur non-Axios (réseau, etc.)
      console.error('Erreur inconnue lors de la création de la formation:', error);
      throw new Error('Impossible de communiquer avec le serveur. Veuillez vérifier votre connexion Internet.');
    }
  }
};