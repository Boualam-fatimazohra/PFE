/* eslint-disable @typescript-eslint/no-explicit-any */
import apiClient from './apiClient';

export interface Encadrant {
  _id: string;
  utilisateur: {
    nom: string;
    prenom: string;
    email: string;
  };
  type?: string;
  specialite?: string;
}

export interface FormationBase {
  _id: string;
  nom: string;
  description: string;
  duree: number;
  objectifs?: string[];
  prerequis?: string[];
}

export interface FormationFab extends FormationBase {
  baseFormation: FormationBase;
  dateDebut:string,
  dateFin:string,
  status: string;
  categorie?: string;
  niveau?: string;
}

export interface EncadrantFormation {
  _id: string;
  encadrant: Encadrant;
  formationBase: FormationBase;
  dateAssignment: string;
}

export interface FormationWithEncadrants extends FormationBase {
    image: string;
    formation?: any; // à préciser si possible
    dateDebut: string;
    dateFin?: string;
    status: string;
    categorie?: string;
    niveau?: string;
    encadrants: {
      entity: any;
      nom?: string;
      prenom?: string;
      email?: string;
      type?: string;
      specialite?: string;
      dateAssignment: string;
    }[];
  }
  

// Récupérer toutes les formations avec leurs encadrants
export const listFormationsWithEncadrants = async () => {
  try {
    const response = await apiClient.get('/encadrant-formations');
    return response.data;
  } catch (error) {
    console.error('Error fetching formations with encadrants:', error);
    throw error;
  }
};

// Assigner un encadrant à une formation
export const assignEncadrantToFormation = async (encadrantId: string, formationBaseId: string, dateAssignment?: Date) => {
  try {
    const payload = {
      encadrantId,
      formationBaseId,
      dateAssignment: dateAssignment || new Date()
    };
    const response = await apiClient.post('/encadrant-formations', payload);
    return response.data;
  } catch (error) {
    console.error('Error assigning encadrant to formation:', error);
    throw error;
  }
};

// Récupérer tous les assignments
export const getAllAssignments = async () => {
  try {
    const response = await apiClient.get('/encadrant-formations');
    return response.data;
  } catch (error) {
    console.error('Error fetching all assignments:', error);
    throw error;
  }
};

// Récupérer un assignment par son ID
export const getAssignmentById = async (id: string) => {
  try {
    const response = await apiClient.get(`/encadrant-formations/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching assignment ${id}:`, error);
    throw error;
  }
};

// Mettre à jour un assignment
export const updateAssignment = async (id: string, dateAssignment: Date) => {
  try {
    const payload = { dateAssignment };
    const response = await apiClient.put(`/encadrant-formations/${id}`, payload);
    return response.data;
  } catch (error) {
    console.error(`Error updating assignment ${id}:`, error);
    throw error;
  }
};

// Supprimer un assignment
export const deleteAssignment = async (id: string) => {
  try {
    const response = await apiClient.delete(`/encadrant-formations/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting assignment ${id}:`, error);
    throw error;
  }
};

// Récupérer toutes les formations pour un encadrant spécifique
export const getFormationsByEncadrant = async (encadrantId: string) => {
  try {
    const response = await apiClient.get(`/encadrant-formations/encadrant/${encadrantId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching formations for encadrant ${encadrantId}:`, error);
    throw error;
  }
};

// Récupérer tous les encadrants pour une formation spécifique
export const getEncadrantsByFormation = async (formationId: string) => {
  try {
    const response = await apiClient.get(`/encadrant-formations/formation/${formationId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching encadrants for formation ${formationId}:`, error);
    throw error;
  }
};

// Obtenir des statistiques sur les encadrants et formations
export const getEncadrantFormationStats = async () => {
  try {
    const response = await apiClient.get('/encadrant-formations/stats');
    return response.data;
  } catch (error) {
    console.error('Error fetching encadrant-formation statistics:', error);
    throw error;
  }
};