/* eslint-disable @typescript-eslint/no-explicit-any */
import apiClient from './apiClient';

export const createEDC = async (edcData: { ville: string }) => {
  try {
    const response = await apiClient.post('/edc', edcData);
    return response.data;
  } catch (error) {
    console.error('Error creating EDC:', error);
    throw error;
  }
};

export const getAllEDCs = async () => {
  try {
    const response = await apiClient.get('/edc');
    return response.data;
  } catch (error) {
    console.error('Error fetching EDCs:', error);
    throw error;
  }
};

export const getEDCById = async (id: string) => {
  try {
    const response = await apiClient.get(`/edc/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching EDC ${id}:`, error);
    throw error;
  }
};

export const deleteEDC = async (id: string) => {
  try {
    const response = await apiClient.delete(`/edc/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting EDC ${id}:`, error);
    throw error;
  }
};

export const getFormateursEdc = async () => {
  try {
    const response = await apiClient.get('/edc/getFormateurEDC');
    return response.data;
  } catch (error) {
    console.error('Error fetching EDC formateurs:', error);
    throw error;
  }
};

export const getFormationsEdc = async () => {
  try {
    const response = await apiClient.get('/edc/getFormationEDC');
    return response.data;
  } catch (error) {
    console.error('Error fetching EDC formations:', error);
    throw error;
  }
};

export const getBeneficiairesEdc = async () => {
  try {
    const response = await apiClient.get('/edc/getBeneficiairesEDC');
    return response.data;
  } catch (error) {
    console.error('Error fetching EDC beneficiaires:', error);
    throw error;
  }
};