/* eslint-disable @typescript-eslint/no-explicit-any */
import apiClient from './apiClient';

export const createFab = async (FabData: { ville: string }) => {
  try {
    const response = await apiClient.post('/fab', FabData);
    return response.data;
  } catch (error) {
    console.error('Error creating Fab:', error);
    throw error;
  }
};

export const getAllFabs = async () => {
  try {
    const response = await apiClient.get('/Fab');
    return response.data;
  } catch (error) {
    console.error('Error fetching Fabs:', error);
    throw error;
  }
};

export const getFabById = async (id: string) => {
  try {
    const response = await apiClient.get(`/Fab/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching Fab ${id}:`, error);
    throw error;
  }
};

export const deleteFab = async (id: string) => {
  try {
    const response = await apiClient.delete(`/Fab/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting Fab ${id}:`, error);
    throw error;
  }
};

export const getFormateursFab = async () => {
  try {
    const response = await apiClient.get('/Fab/getFormateurFab');
    return response.data;
  } catch (error) {
    console.error('Error fetching Fab formateurs:', error);
    throw error;
  }
};

export const getFormationsFab = async () => {
  try {
    const response = await apiClient.get('/fabs/getFormationFab');
    return response.data;
  } catch (error) {
    console.error('Error fetching Fab formations:', error);
    throw error;
  }
};

export const getBeneficiairesFab = async () => {
  try {
    const response = await apiClient.get('/Fab/getBeneficiairesFab');
    return response.data;
  } catch (error) {
    console.error('Error fetching Fab beneficiaires:', error);
    throw error;
  }
};
export const getNbrBeneficiairesByFormation = async (id: string) => {
  try {
    const response = await apiClient.get(`/Fab/getNbrBeneficiairesByFormation/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching number of beneficiaries for formation ${id}:`, error);
    throw error;
  }
};

export function getCalendarEvents(startDate: any, endDate: any) {
    throw new Error('Function not implemented.');
}
export function updateEvent(eventId: any, arg1: { dateDebut: any; dateFin: any; }) {
    throw new Error('Function not implemented.');
}

