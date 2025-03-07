import apiClient from './apiClient';

interface Formation {
  nom: string;
  dateDebut: string;
  dateFin: string;
  description?: string;
  lienInscription: string;
  status?: string;
  tags?: string;
  categorie?: string;
  niveau?: string;
  image?: File | string; // Allow both File (for uploads) and string (for URLs)
}

export const getAllFormations = async () => {
  try {
    const response = await apiClient.get('/formation/getFormations');
    return response.data;
  } catch (error) {
    console.error('Error fetching formations:', error);
    throw error;
  }
};
export const getNbrBeneficiairesParFormateur=async ()=>{
  try {
    const response = await apiClient.get('/beneficiaires/getNbrBeneficiairesParFormateur');
    return response.data;
  }
  catch(error){
    console.error('Error fetching formations:', error);
    throw error;

  }}

export const getFormationById = async (id: string) => {
  try {
    const response = await apiClient.get(`/formation/GetOneFormation/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching formation ${id}:`, error);
    throw error;
  }
};

// In formationService.ts
export const createFormation = async (formationData: any) => {
  try {
    const formData = new FormData();
    
    // Append all form fields to FormData
    Object.keys(formationData).forEach(key => {
      // Skip image - we'll handle it separately
      if (key !== 'image' && formationData[key] !== null && formationData[key] !== undefined) {
        formData.append(key, formationData[key]);
      }
    });
    
    // Append image if it exists and is a File
    if (formationData.image && formationData.image instanceof File) {
      formData.append('image', formationData.image);
    }
    
    const response = await apiClient.post('/formation/Addformation', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Error creating formation:', error);
    throw error;
  }
};

export const updateFormation = async (id: string, formationData: Partial<Formation>) => {
  try {
    // Check if there's an image file in the update data
    if (formationData.image instanceof File) {
      // Create FormData to handle file upload
      const formData = new FormData();
      
      // Append all fields to FormData
      Object.entries(formationData).forEach(([key, value]) => {
        if (key === 'image' && value instanceof File) {
          formData.append('image', value);
        } else if (value !== undefined) {
          formData.append(key, String(value));
        }
      });
      
      const response = await apiClient.put(`/formation/UpdateFormation/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      return response.data;
    } else {
      // Regular JSON update if no file is involved
      const response = await apiClient.put(`/formation/UpdateFormation/${id}`, formationData);
      return response.data;
    }
  } catch (error) {
    console.error(`Error updating formation ${id}:`, error);
    throw error;
  }
};

export const deleteFormation = async (id: string) => {
  try {
    const response = await apiClient.delete(`/formation/DeleteFormation/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting formation ${id}:`, error);
    throw error;
  }
};