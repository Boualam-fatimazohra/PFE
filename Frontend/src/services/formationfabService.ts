/* eslint-disable no-useless-catch */
/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';
import apiClient from './apiClient';
import { Formation } from '../components/formation-modal/types'; // Adjust the import path
interface ConfirmationData {
  id: string; // L'ID du bénéficiaire
  confirmationAppel: boolean;
  confirmationEmail: boolean;
}
// incrémenter le step

export const validerFormation = async (formationId: string) => {
  if (!formationId) {
    throw new Error("ID de formation requis");
  }
  try {
    const response = await apiClient.put(`/formation/valider-foramtion/${formationId}`);
    return response.data;
  } catch (error) {
    // Gestion des différents types d'erreurs
    if (axios.isAxiosError(error)) {
      // Erreurs HTTP spécifiques
      if (error.response) {
        // Le serveur a répondu avec un code d'erreur
        switch (error.response.status) {
          case 400:
            throw new Error("Données de requête invalides: " + (error.response.data?.message || "ID de formation invalide"));
          case 404:
            throw new Error("Formation non trouvée: " + (error.response.data?.message || "Aucun brouillon de formation trouvé"));
          case 403:
            throw new Error("Accès non autorisé à cette formation");
          default:
            throw new Error(error.response.data?.message || "Erreur lors de la validation de la formation");
        }
      } else if (error.request) {
        // La requête a été faite mais pas de réponse reçue
        throw new Error("Aucune réponse du serveur. Vérifiez votre connexion internet.");
      }
    }
    
    // Autres types d'erreurs
    console.error("Erreur lors de la validation de la formation:", error);
    throw new Error("Erreur inattendue lors de la validation de la formation");
  }
};
export const updateBeneficiaireConfirmations = async (idFormation: string, confirmations: ConfirmationData[]) => {
  try {
    // Envoi de la requête avec l'ID de la formation dans l'URL et la liste des confirmations dans le corps
    const response = await apiClient.post(`beneficiaires/updateConfirmationBeneficiaire/${idFormation}`, confirmations);
    return response.data; // Retourne la réponse en cas de succès
  } catch (error) {
    // Gestion des erreurs
    console.error('Erreur lors de la mise à jour des confirmations:', error);
    throw new Error(
      error.response?.data?.message ||
      'Erreur lors de la mise à jour des confirmations'
    );
  }
};
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

export const createFormation = async (formData: FormData) => {
  try {
    // Log the FormData contents for debugging (remove in production)
    console.log('Form data being sent:');
    for (const pair of formData.entries()) {
      console.log(pair[0], pair[1]);
    }

    // Send the request with proper headers
    const response = await apiClient.post('/formationfab/addEvenement', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      // Add timeout to prevent hanging requests
      timeout: 30000
    });
    
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Axios error details:', error.response?.data || error.message);
      
      if (error.response) {
        // Handle specific status codes
        if (error.response.status === 401) {
          throw new Error("Vous n'êtes pas autorisé à effectuer cette action");
        } else if (error.response.status === 413) {
          throw new Error("Le fichier téléchargé est trop volumineux");
        } else if (error.response.status === 415) {
          throw new Error("Type de fichier non pris en charge");
        } else if (error.response.status === 422) {
          throw new Error("Données invalides: " + (error.response.data.message || "Veuillez vérifier les champs du formulaire"));
        } else {
          throw new Error(error.response.data.message || "Erreur lors de la création: " + error.response.status);
        }
      } else if (error.request) {
        // Request was made but no response received
        throw new Error("Pas de réponse du serveur. Veuillez vérifier votre connexion.");
      } else {
        throw new Error("Problème de connexion au serveur");
      }
    }
    // Re-throw any other errors
    throw error;
  }
};
export const updateFormation = async (id, formationData) => {
  try {
    // Check if there's an image file in the update data
    if (formationData.image instanceof File) {
      // Create FormData to handle file upload
      const formData = new FormData();
      
      // Log what we're sending to the API
      console.log("Preparing FormData for API with image file:");
      
      // Append all fields to FormData
      Object.entries(formationData).forEach(([key, value]) => {
        if (key === 'image' && value instanceof File) {
          console.log(`Adding file: ${key}, filename: ${value.name}`);
          formData.append('image', value);
        } else if (value !== undefined) {
          console.log(`Adding field: ${key}, value: ${String(value)}`);
          formData.append(key, String(value));
        }
      });
      
      // Ensure title is explicitly added to FormData
      if (!formData.has('title') && formationData.title) {
        console.log(`Explicitly adding title: ${formationData.title}`);
        formData.append('title', formationData.title);
      }
      
      const response = await apiClient.put(`/formation/UpdateFormation/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      console.log("API Response:", response.data);
      return response.data;
    } else {
      // Regular JSON update if no file is involved
      console.log("Sending JSON update to API:", formationData);
      
      // Ensure the title is included in the data being sent
      const dataToSend = {
        ...formationData,
        title: formationData.nom  // Explicitly include title
      };
      
      const response = await apiClient.put(`/formation/UpdateFormation/${id}`, dataToSend);
      console.log("API Response:", response.data);
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
export const createFormationDraft = async (formationData: Formation): Promise<{ message: string; data: Formation }> => {
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