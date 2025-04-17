/* eslint-disable @typescript-eslint/no-explicit-any */
import apiClient from './apiClient';

export interface BaseFormation {
  _id: string;
  nom: string;
  dateDebut: string;
  dateFin: string;
  description: string;
  image?: string;
}

export interface Encadrant {
  _id: string;
  utilisateur: {
    _id: string;
    nom: string;
    prenom: string;
    email: string;
  };
  type?: string;
  specialite?: string;
}

export interface EncadrantAssignment {
  _id: string;
  encadrant: Encadrant;
  dateAssignment: string;
}

export interface ProjetFab {
  _id: string;
  baseFormation: BaseFormation;
  status: 'En Cours' | 'Terminé' | 'Avenir' | 'Replanifier';
  progress: number;
  nombreParticipants: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProjetFabWithEncadrants extends ProjetFab {
  encadrants: EncadrantAssignment[];
}

// Récupérer tous les projets avec leurs encadrants
export const getAllProjetsFab = async () => {
  try {
    const response = await apiClient.get('/projetfab/');
    return response.data;
  } catch (error) {
    console.error('Error fetching projets fab:', error);
    throw error;
  }
};

// Créer un nouveau projet de fabrication
export const createProjetFab = async (data: FormData) => {
  try {
    const response = await apiClient.post('/projetsfab/', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error creating projet fab:', error);
    throw error;
  }
};

// Récupérer un projet de fabrication par son ID
export const getProjetFabById = async (id: string) => {
  try {
    const response = await apiClient.get(`/projetsfab/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching projet fab ${id}:`, error);
    throw error;
  }
};

// Mettre à jour un projet de fabrication
export const updateProjetFab = async (id: string, data: any) => {
  try {
    const response = await apiClient.put(`/projetsfab/${id}`, data);
    return response.data;
  } catch (error) {
    console.error(`Error updating projet fab ${id}:`, error);
    throw error;
  }
};

// Supprimer un projet de fabrication
export const deleteProjetFab = async (id: string) => {
  try {
    const response = await apiClient.delete(`/projetsfab/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting projet fab ${id}:`, error);
    throw error;
  }
};

// Récupérer les projets par statut
export const getProjetsFabByStatus = async (status: string) => {
  try {
    const response = await apiClient.get(`/projetsfab/status/${status}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching projets fab with status ${status}:`, error);
    throw error;
  }
};

// Mettre à jour le statut d'un projet
export const updateProjetFabStatus = async (id: string, status: string) => {
  try {
    const response = await apiClient.patch(`/projetsfab/${id}/status`, { status });
    return response.data;
  } catch (error) {
    console.error(`Error updating status for projet fab ${id}:`, error);
    throw error;
  }
};

// Mettre à jour la progression d'un projet
export const updateProjetFabProgress = async (id: string, progress: number) => {
  try {
    const response = await apiClient.patch(`/projetsfab/${id}/progress`, { progress });
    return response.data;
  } catch (error) {
    console.error(`Error updating progress for projet fab ${id}:`, error);
    throw error;
  }
};

// Obtenir des statistiques sur les projets de fabrication
export const getProjetFabStats = async () => {
  try {
    const response = await apiClient.get('/projetsfab/stats');
    return response.data;
  } catch (error) {
    console.error('Error fetching projet fab statistics:', error);
    throw error;
  }
};