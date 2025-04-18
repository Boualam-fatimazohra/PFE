import apiClient from './apiClient';

interface CertificatsResponse {
  success: boolean;
  message: string;
  error?: string;
}

export const telechargerCertificats = async (idsBeneficiairesFormation: string[]): Promise<void> => {
  try {
    // Configuration pour recevoir une réponse blob (fichier)
    const response = await apiClient.post(
      '/certification/TelechargerCertificats', 
      { idsBeneficiairesFormation },
      { responseType: 'blob' }
    );
    
    // Créer une URL pour le blob téléchargé
    const url = window.URL.createObjectURL(new Blob([response.data]));
    
    // Créer un élément <a> temporaire pour déclencher le téléchargement
    const link = document.createElement('a');
    link.href = url;
    
    // Nom du fichier téléchargé
    const contentDisposition = response.headers['content-disposition'];
    let filename = 'certificats.zip';
    
    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(/filename="(.+)"/);
      if (filenameMatch.length === 2) {
        filename = filenameMatch[1];
      }
    }
    
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    
    // Nettoyer
    link.remove();
    window.URL.revokeObjectURL(url);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error('Erreur lors du téléchargement des certificats:', error);
    throw new Error(error.response?.data?.message || 'Échec du téléchargement des certificats');
  }
};