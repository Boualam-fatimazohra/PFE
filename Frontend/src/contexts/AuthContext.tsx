import * as React from 'react';
import { createContext, useContext, useState, useEffect } from 'react';
import { login as apiLogin, logout as apiLogout } from '../api/services/authService';

interface User {
  nom: string;
  prenom: string;
  role: string;
  userId: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (credentials: { email: string; password: string }) => Promise<any>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Check if user is logged in on mount
    const userRole = localStorage.getItem('userRole');
    const nom = localStorage.getItem('nom');
    const prenom = localStorage.getItem('prenom');
    const userId = localStorage.getItem('userId');

    if (userRole && userId) {
      setIsAuthenticated(true);
      setUser({
        role: userRole,
        nom: nom || '',
        prenom: prenom || '',
        userId
      });
    }
    
    setIsLoading(false);
  }, []);

  const handleLogin = async (credentials: { email: string; password: string }) => {
    setIsLoading(true);
    try {
      const response = await apiLogin(credentials);
      
      setUser({
        role: response.role,
        nom: response.user?.nom || '',
        prenom: response.user?.prenom || '',
        userId: response.user?.userId || ''
      });
      
      setIsAuthenticated(true);
      return response;
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await apiLogout();
      setIsAuthenticated(false);
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        login: handleLogin,
        logout: handleLogout,
        isLoading
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};