/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';
import apiClient from './apiClient';
import { Formation } from '../components/formation-modal/types'; // Adjust the import path

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
const apiCliente = axios.create({
  baseURL: 'http://localhost:5000',
  headers: { 'Content-Type': 'application/json' }
});
export const sendEvaluationFormation = async (beneficiaryIds: string[], formationId: string) => {
  try {
    const response = await apiCliente.post('/api/evaluation/sendLinkToBeneficiare', { beneficiaryIds, formationId });
    return response.data;
  } catch (error) {
    console.error("Error d'envoi de lien d'évaluation:", error);
    throw error;
  }
};
//formations par formateur
export const getAllFormations = async () => {
  try {
    const response = await apiClient.get('/formation/getAllFormationsWithDraft');
    return response.data;
  } catch (error) {
    console.error('Error fetching formations:', error);
    throw error;
  }
};

//all formations de tous les formateurs
export const getAllFormationsManager = async () => {
  try {
    const response = await apiClient.get('/formation/getAllFormations');
    return response.data;
  } catch (error) {
    console.error('Error fetching authenticated formations:', error);
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
  export const uploadBeneficiairesFromExcel = async (formationId, file) => {
    try {
      // Création d'un FormData pour l'envoi du fichier
      const formData = new FormData();
      formData.append('file', file);
      formData.append('idFormation', formationId);
      
      // Notez bien que c'est une requête POST (pas GET) puisque vous envoyez des données
      const response = await apiClient.post('/beneficiaires/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return response.data;
    } catch (error) {
      console.error('Error uploading beneficiaires:', error);
      throw error;
    }
  };
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
export const createFormationDraft = async (formationData: Formation): Promise<Formation> => {
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
    // Error handling
    throw error; // Make sure to rethrow
  }
};