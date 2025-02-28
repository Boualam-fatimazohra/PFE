/* eslint-disable @typescript-eslint/no-explicit-any */
import apiClient from './apiClient';

interface LoginResponse {
  message: string;
  role: string;
  user: {
    nom: string;
    prenom: string;
    userId: string;
  };
}
// Connexion utilisateur
export const login = async (email: string, password: string): Promise<LoginResponse> => {
  try {
    const response = await apiClient.post<LoginResponse>('/auth/signIn', { email, password });
    console.log(response.data);
    return response.data;

  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Login failed');
  }
};
// Déconnexion utilisateur
export const logout = async (): Promise<void> => {
  try {
    await apiClient.get('/auth/logout');
    window.location.href = '/'; // Rediriger vers la page de connexion après déconnexion
  } catch (error) {
    console.error('Logout failed:', error);
  }
};
// Ajouter ces nouvelles fonctions à votre fichier authServices.ts
export const forgotPassword = async (email: string): Promise<void> => {
    try {
      await apiClient.post('/auth/forgotpassword', { email });
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Échec de l\'envoi du code');
    }
  };
  
  export const verifyResetCode = async (code: string): Promise<void> => {
    try {
      await apiClient.post('/auth/verifyresetcode', { code });
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Code invalide ou expiré');
    }
  };
  
  export const changePassword = async (newPassword: string): Promise<void> => {
    try {
      await apiClient.post('/auth/changepassword', { newPassword });
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Échec de la modification du mot de passe');
    }
  };


