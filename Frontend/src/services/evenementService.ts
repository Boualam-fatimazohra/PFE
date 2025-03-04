import apiClient from './apiClient';

// Interface for Event data structure
export interface Evenement {
  _id: string;
  dateDebut: string;
  dateFin: string;
  heureDebut: string;
  heureFin: string;
  sujet: string;
  organisateurType: 'Formateur' | 'Coordinateur';
  organisateur: string;
  createdAt?: string;
  updatedAt?: string;
}

// Get all events for the current user
export const getMesEvenements = async (): Promise<Evenement[]> => {
  try {
    const response = await apiClient.get('/evenement/getEvenements');
    return response.data;
  } catch (error) {
    console.error('Error fetching events:', error);
    throw error;
  }
};

// Create a new event
export const addEvenement = async (eventData: Omit<Evenement, '_id'>): Promise<Evenement> => {
  try {
    const response = await apiClient.post('/evenement/addEvenement', eventData);
    return response.data.evenement;
  } catch (error) {
    console.error('Error creating event:', error);
    throw error;
  }
};

// Update an existing event
export const updateEvenement = async (id: string, eventData: Partial<Evenement>): Promise<Evenement> => {
  try {
    const response = await apiClient.put(`/evenement/updateEvenement/${id}`, eventData);
    return response.data.evenement;
  } catch (error) {
    console.error(`Error updating event ${id}:`, error);
    throw error;
  }
};

// Delete an event
export const deleteEvenement = async (id: string): Promise<void> => {
  try {
    await apiClient.delete(`/evenement/deleteEvenement/${id}`);
  } catch (error) {
    console.error(`Error deleting event ${id}:`, error);
    throw error;
  }
};