/* eslint-disable @typescript-eslint/no-explicit-any */
import apiClient from './apiClient';

export interface Fab {
  _id: string;
  // Autres propriétés de Fab qui seraient nécessaires
  entity: {
    _id: string;
    // Propriétés de l'entité
  };
}

export interface Equipement {
  type: any;
  id: string;
  nom: any;
  _id: string;
  fab: Fab;
  etat: string;
  image: string;
  createdAt: string;
  updatedAt: string;
}

// Récupérer tous les équipements
export const getAllEquipements = async () => {
  try {
    const response = await apiClient.get('/equipement/');
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des équipements:', error);
    throw error;
  }
};

// Créer un nouvel équipement
export const createEquipement = async (data: FormData) => {
  try {
    const response = await apiClient.post('/equipements/', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    });
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la création de l\'équipement:', error);
    throw error;
  }
};

// Récupérer un équipement par son ID
export const getEquipementById = async (id: string) => {
  try {
    const response = await apiClient.get(`/equipements/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Erreur lors de la récupération de l'équipement ${id}:`, error);
    throw error;
  }
};

// Mettre à jour un équipement
export const updateEquipement = async (id: string, data: any) => {
  try {
    const response = await apiClient.put(`/equipements/${id}`, data);
    return response.data;
  } catch (error) {
    console.error(`Erreur lors de la mise à jour de l'équipement ${id}:`, error);
    throw error;
  }
};

// Supprimer un équipement
export const deleteEquipement = async (id: string) => {
  try {
    const response = await apiClient.delete(`/equipements/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Erreur lors de la suppression de l'équipement ${id}:`, error);
    throw error;
  }
};

// Récupérer les équipements par fab
export const getEquipementsByFab = async (fabId: string) => {
  try {
    const response = await apiClient.get(`/equipements/fab/${fabId}`);
    return response.data;
  } catch (error) {
    console.error(`Erreur lors de la récupération des équipements par fab ${fabId}:`, error);
    throw error;
  }
};

// Récupérer les équipements par état
export const getEquipementsByEtat = async (etat: string) => {
  try {
    const response = await apiClient.get(`/equipements/etat/${etat}`);
    return response.data;
  } catch (error) {
    console.error(`Erreur lors de la récupération des équipements par état "${etat}":`, error);
    throw error;
  }
};