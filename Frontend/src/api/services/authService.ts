import apiClient from '../apiClient';

export const login = async (credentials: { email: string; password: string }) => {
  try {
    const response = await apiClient.post('/auth/signIn', credentials);
    
    // Store user info in localStorage for client-side access
    if (response.data.user) {
      localStorage.setItem('userRole', response.data.role);
      localStorage.setItem('nom', response.data.user.nom || '');
      localStorage.setItem('prenom', response.data.user.prenom || '');
      localStorage.setItem('userId', response.data.user.userId || '');
    }
    
    return response.data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

export const logout = async () => {
  try {
    await apiClient.get('/auth/logout');
    
    // Clear localStorage
    localStorage.removeItem('userRole');
    localStorage.removeItem('nom');
    localStorage.removeItem('prenom');
    localStorage.removeItem('userId');
    
    return { success: true };
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
};

export const forgotPassword = async (email: string) => {
  try {
    const response = await apiClient.post('/auth/forgot-password', { email });
    return response.data;
  } catch (error) {
    console.error('Forgot password error:', error);
    throw error;
  }
};