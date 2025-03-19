import apiClient from '../services/apiClient';

export interface BeneficiaireFileUpload {
  _id?: string;
  cloudinaryId: string;
  cloudinaryUrl: string;
  cloudinaryFolder: string;
  originalFilename: string;
  fileSize: number;
  fileType: string;
  formation: string;
  uploadedBy: string | {
    _id: string;
    nom: string;
    prenom: string;
  };
  description?: string;
  tags?: string[];
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Upload a file for beneficiaries to a specific formation
 * @param formationId The ID of the formation
 * @param file The file to upload
 * @param description Optional description of the file
 * @param tags Optional tags for the file
 * @returns Promise with the upload result
 */
export const uploadBeneficiaireFile = async (
  formationId: string,
  file: File,
  description?: string,
  tags?: string[]
): Promise<{ id: string; filename: string; url: string; uploadDate: string }> => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('formationId', formationId);
    
    if (description) {
      formData.append('description', description);
    }
    
    if (tags && tags.length > 0) {
      formData.append('tags', tags.join(','));
    }
    
    const response = await apiClient.post('/beneficiaire-files/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    
    return response.data.fileUpload;
  } catch (error) {
    console.error('Error uploading beneficiaire file:', error);
    throw error;
  }
};

/**
 * Get all files for a specific formation
 * @param formationId The ID of the formation
 * @returns Promise with the list of files
 */
export const getFormationFiles = async (formationId: string): Promise<BeneficiaireFileUpload[]> => {
  try {
    const response = await apiClient.get(`/beneficiaire-files/formation/${formationId}`);
    return response.data.files;
  } catch (error) {
    console.error('Error fetching formation files:', error);
    throw error;
  }
};

/**
 * Get a specific file by ID
 * @param fileId The ID of the file
 * @returns Promise with the file details
 */
export const getFileById = async (fileId: string): Promise<BeneficiaireFileUpload> => {
  try {
    const response = await apiClient.get(`/beneficiaire-files/${fileId}`);
    return response.data.file;
  } catch (error) {
    console.error(`Error fetching file ${fileId}:`, error);
    throw error;
  }
};

/**
 * Delete a file
 * @param fileId The ID of the file to delete
 * @returns Promise with the deletion result
 */
export const deleteFile = async (fileId: string): Promise<{ deletedFileId: string }> => {
  try {
    const response = await apiClient.delete(`/beneficiaire-files/${fileId}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting file ${fileId}:`, error);
    throw error;
  }
};

/**
 * Update file metadata
 * @param fileId The ID of the file
 * @param metadata The metadata to update (description and/or tags)
 * @returns Promise with the updated file
 */
export const updateFileMetadata = async (
  fileId: string,
  metadata: { description?: string; tags?: string[] }
): Promise<BeneficiaireFileUpload> => {
  try {
    const response = await apiClient.patch(`/beneficiaire-files/${fileId}`, metadata);
    return response.data.file;
  } catch (error) {
    console.error(`Error updating file metadata for ${fileId}:`, error);
    throw error;
  }
};

/**
 * Process beneficiaries from an uploaded Excel file
 * This is a placeholder function - you'll need to implement backend functionality
 * @param fileId The ID of the uploaded file to process
 * @returns Promise with the processing result
 */
export const processBeneficiairesFromFile = async (fileId: string): Promise<{ success: boolean; message: string; beneficiairesCount?: number }> => {
  try {
    // This would call a yet-to-be-implemented backend endpoint to process the Excel file
    const response = await apiClient.post(`/beneficiaires/process-from-file/${fileId}`);
    return response.data;
  } catch (error) {
    console.error(`Error processing beneficiaires from file ${fileId}:`, error);
    throw error;
  }
};