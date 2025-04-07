import apiClient from '@/services/apiClient';
import { BeneficiaireWithPresenceResponse } from '@/components/formation-modal/types';

interface BeneficiaireExcelUploadResponse {
  message: string;
  nouveauxBeneficiaires: number;
  nouvellesInstances: number;
}

interface ExcelExportResponse {
  blob: Blob;
  filename: string;
}
export const exportBeneficiairesListToExcel = async (
  beneficiaires: any[]
): Promise<ExcelExportResponse> => {
  try {
    const response = await apiClient.post(
      '/beneficiaires/uploadList', 
      { 
        beneficiaires: beneficiaires.map(b => ({ beneficiaire: b })) // Ajouter l'encapsulation
      },
      { responseType: 'blob' }
    );

    // Extraction du nom de fichier depuis les headers
    const contentDisposition = response.headers['content-disposition'];
    const filenameMatch = contentDisposition?.match(/filename="?(.+)"?/);
    const filename = filenameMatch ? filenameMatch[1] : `beneficiaires_export_${Date.now()}.xlsx`;

    return {
      blob: new Blob([response.data], { type: response.headers['content-type'] }),
      filename
    };
  } catch (error) {
    // Gestion des erreurs JSON du serveur
    if (error.response?.data instanceof Blob) {
      const errorText = await new Response(error.response.data).text();
      const errorData = JSON.parse(errorText);
      throw new Error(errorData.message || 'Erreur lors de l\'export');
    }

    console.error('Erreur lors de l\'export:', error);
    throw new Error('Erreur lors de la génération du fichier Excel');
  }
};
export const getBeneficiairesWithPresence = async (formationId: string): Promise<BeneficiaireWithPresenceResponse[]> => {
  try {
    const response = await apiClient.get(`/beneficiaires/getBeneficiairesWithPresence/${formationId}`);
    
    // La réponse contiendra la liste des bénéficiaires avec leurs présences et autres formations
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des bénéficiaires avec leurs présences:', error);
    throw error; // Propager l'erreur pour la gérer à un autre endroit si nécessaire
  }
};
// la fct pour telecharger la liste des bénéficiaire sous forme excel
export const exportBeneficiairesToExcel = async (formationId: string): Promise<any> => {
  try {
    const response = await apiClient.get(`/beneficiaires/export/${formationId}`, {
      responseType: 'blob', // Important pour la réception des fichiers binaires
    });

    // Extraction du nom de fichier depuis les headers
    const contentDisposition = response.headers['content-disposition'];
    const filenameMatch = contentDisposition?.match(/filename="?(.+)"?/);
    const filename = filenameMatch ? filenameMatch[1] : `beneficiaires_${formationId}.xlsx`;

    return {
      blob: new Blob([response.data], { type: response.headers['content-type'] }),
      filename
    };
  } catch (error) {
    // Gestion des erreurs JSON du serveur
    if (error.response?.data instanceof Blob) {
      const errorText = await new Response(error.response.data).text();
      const errorData = JSON.parse(errorText);
      throw new Error(errorData.message || 'Erreur lors de l\'export');
    }

    console.error('Erreur d\'export des bénéficiaires:', error);
    throw new Error('Erreur lors du téléchargement du fichier');
  }
};
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
