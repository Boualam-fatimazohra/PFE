import axios from 'axios';
import apiClient from './apiClient';
// debut : fct qui enregistre les beneficiaire sans doublon
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
// fin : fct qui enregistre les beneficiaire sans doublon

// Upload a file
export const uploadFile = async (file, formationId, description, tags) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('formationId', formationId);
    if (description) formData.append('description', description);
    if (tags) formData.append('tags', tags);

    const response = await apiClient.post('/beneficiaire-files/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
};

// Get all files for a formation
export const getFormationFiles = async (formationId) => {
  try {
    const response = await apiClient.get(`/beneficiaire-files/formation/${formationId}`);
    return response.data;
  } catch (error) {
    console.error('Error retrieving files:', error);
    throw error;
  }
};

// Delete a file
export const deleteFile = async (fileId) => {
  try {
    const response = await apiClient.delete(`/beneficiaire-files/${fileId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting file:', error);
    throw error;
  }
};
