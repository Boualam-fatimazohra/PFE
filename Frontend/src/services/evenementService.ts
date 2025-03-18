import apiClient from './apiClient';

// Récupérer tous les événements
export const getAllEvenements = async () => {
  try {
    const response = await apiClient.get('/evenements');
    return response.data;
  } catch (error) {
    console.error('Error fetching events:', error);
    throw error;
  }
};

export const getEventsCountByRole = async () => {
    try {
      const response = await apiClient.get('evenement/stats/events-count');
      return response.data;
    } catch (error) {
      console.error('Error fetching events count by role:', error);
      throw error;
    }
  };

// Récupérer un événement par ID
export const getEvenementById = async (id: string) => {
  try {
    const response = await apiClient.get(`/evenements/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching event by ID:', error);
    throw error;
  }
};

// Créer un nouvel événement
export const createEvenement = async (eventData: {
  dateDebut: Date;
  dateFin: Date;
  heureDebut: string;
  heureFin: string;
  titre: string;
  description?: string;
  categorie?: string;
}) => {
  try {
    const response = await apiClient.post('/evenements', eventData);
    return response.data;
  } catch (error) {
    console.error('Error creating event:', error);
    throw error;
  }
};

// Mettre à jour un événement
export const updateEvenement = async (id: string, eventData: {
  dateDebut?: Date;
  dateFin?: Date;
  heureDebut?: string;
  heureFin?: string;
  titre?: string;
  description?: string;
  categorie?: string;
}) => {
  try {
    const response = await apiClient.put(`/evenements/${id}`, eventData);
    return response.data;
  } catch (error) {
    console.error('Error updating event:', error);
    throw error;
  }
};

// Supprimer un événement
export const deleteEvenement = async (id: string) => {
  try {
    const response = await apiClient.delete(`/evenements/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting event:', error);
    throw error;
  }
};

// Récupérer les événements par mois
export const getEvenementByMonth = async (month: string) => {
  try {
    const response = await apiClient.post('/evenements/by-month', { month });
    return response.data;
  } catch (error) {
    console.error('Error fetching events by month:', error);
    throw error;
  }
};

// Récupérer les événements créés par un utilisateur spécifique
export const getMesEvenements = async () => {
  try {
    const response = await apiClient.get('/evenements/mes-evenements');
    return response.data;
  } catch (error) {
    console.error('Error fetching user events:', error);
    throw error;
  }
};