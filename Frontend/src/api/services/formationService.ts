import apiClient from '../apiClient';

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
  image?: File;
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

export const getFormationById = async (id: string) => {
  try {
    const response = await apiClient.get(`/formation/GetOneFormation/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching formation ${id}:`, error);
    throw error;
  }
};

export const createFormation = async (formationData: Formation) => {
  try {
    const formData = new FormData();
    
    // Append all form fields to FormData
    Object.keys(formationData).forEach(key => {
      if (key === 'image' && formationData[key] instanceof File) {
        formData.append('image', formationData[key] as File);
      } else {
        formData.append(key, formationData[key] as string);
      }
    });
    
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
    const response = await apiClient.put(`/formation/UpdateFormation/${id}`, formationData);
    return response.data;
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