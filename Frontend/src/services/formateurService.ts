/* eslint-disable @typescript-eslint/no-explicit-any */
import apiClient from './apiClient';

interface Formateur {
  _id?: string;
  utilisateur?: {
    nom: string;
    prenom: string;
    email: string;
    numeroTelephone?: string;
    role: string;
  };
  manager?: string | any;
  coordinateur?: string | any;
}

export const getAllFormateurs = async () => {
  try {
    const response = await apiClient.get('/formateur/getFormateurs');
    return response.data;
  } catch (error) {
    console.error('Error fetching formateurs:', error);
    throw error;
  }
};

export const getFormateurById = async (id: string) => {
  try {
    const response = await apiClient.get(`/formateur/getFormateurById/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching formateur ${id}:`, error);
    throw error;
  }
};

export const getFormateurFormations = async (id: string) => {
  try {
    const response = await apiClient.get(`/formateur/getFormateurFormations/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching formations for formateur ${id}:`, error);
    throw error;
  }
};

export const getFormateursByManager = async () => {
  try {
    const response = await apiClient.get('/formateur/getFormateurByManager');
    return response.data;
  } catch (error) {
    console.error('Error fetching formateurs by manager:', error);
    throw error;
  }
};

export const createFormateur = async (formateurData: any) => {
  try {
    const response = await apiClient.post('/formateur/Addformateur', formateurData);
    return response.data;
  } catch (error) {
    console.error('Error creating formateur:', error);
    throw error;
  }
};

export const updateFormateur = async (id: string, formateurData: any) => {
  try {
    const response = await apiClient.put(`/formateur/updateFormateur/${id}`, formateurData);
    return response.data;
  } catch (error) {
    console.error(`Error updating formateur ${id}:`, error);
    throw error;
  }
};

export const deleteFormateur = async (id: string) => {
  try {
    const response = await apiClient.delete(`/formateur/deleteFormateur/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting formateur ${id}:`, error);
    throw error;
  }
};
// debut :
export const getNbrEvenementsAssocies= async ()=>{
  try {
    console.log("debut de getNbrEvents.............")
    const response=await apiClient.get('/formateur/getNbrEvenementsAssocies');
    return response.data;
  } catch (error) {
    console.log("erreuuuuuuur dans getNbrEvenementsAssocies ",error);
    throw error;
  }
}
// fin : 