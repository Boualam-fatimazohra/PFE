import apiClient from '@/services/apiClient';

interface BeneficiaireExcelUploadResponse {
  message: string;
  nouveauxBeneficiaires: number;
  nouvellesInstances: number;
}

/**
 * Upload beneficiaries from an Excel file and associate them with a formation
 * 
 * @param file - The Excel file containing beneficiary data
 * @param idFormation - The ID of the formation to associate beneficiaries with
 * @returns Response data containing upload results
 */
export const uploadBeneficiairesFromExcel = async (
  file: File, 
  idFormation: string
): Promise<BeneficiaireExcelUploadResponse> => {
  try {
    // Create FormData to handle file upload
    const formData = new FormData();
    formData.append('file', file);
    formData.append('idFormation', idFormation);
    
    const response = await apiClient.post<BeneficiaireExcelUploadResponse>(
      '/beneficiaires/upload', 
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    
    return response.data;
  } catch (error) {
    console.error('Error uploading beneficiaries:', error);
    throw error;
  }
};

/**
 * Get all beneficiaries
 */
export const getAllBeneficiaires = async () => {
  try {
    const response = await apiClient.get('/beneficiaires');
    return response.data;
  } catch (error) {
    console.error('Error fetching beneficiaires:', error);
    throw error;
  }
};

/**
 * Get beneficiary by ID
 */
export const getBeneficiaireById = async (id: string) => {
  try {
    const response = await apiClient.get(`/beneficiaires/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching beneficiaire ${id}:`, error);
    throw error;
  }
};

/**
 * Update a beneficiary
 */
export const updateBeneficiaire = async (id: string, beneficiaireData: any) => {
  try {
    const response = await apiClient.put(`/beneficiaires/${id}`, beneficiaireData);
    return response.data;
  } catch (error) {
    console.error(`Error updating beneficiaire ${id}:`, error);
    throw error;
  }
};

/**
 * Delete a beneficiary
 */
export const deleteBeneficiaire = async (id: string) => {
  try {
    const response = await apiClient.delete(`/beneficiaires/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting beneficiaire ${id}:`, error);
    throw error;
  }
};

/**
 * Get beneficiaries by formation ID
 */
export const getBeneficiairesByFormation = async (formationId: string) => {
  try {
    const response = await apiClient.get(`/beneficiaires/formation/${formationId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching beneficiaires for formation ${formationId}:`, error);
    throw error;
  }
};