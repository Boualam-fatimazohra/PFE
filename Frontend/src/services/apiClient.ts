// src/api/apiClient.ts
import axios from 'axios';

// Création d'une instance Axios avec une configuration par défaut
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  withCredentials: true, // Important pour envoyer les cookies d'authentification
  headers: {
    'Content-Type': 'application/json'
  }
});

// Intercepteur de réponse pour gérer les erreurs
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Gestion des erreurs 401 (Unauthorized)
      if (error.response.status === 401) {
        console.warn('Session expirée ou utilisateur non authentifié.');
        
        // Suppression des éventuelles données stockées localement
        localStorage.clear();
        
        // Redirection vers la page de connexion si nécessaire
        if (window.location.pathname !== '/') {
          window.location.href = '/';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
