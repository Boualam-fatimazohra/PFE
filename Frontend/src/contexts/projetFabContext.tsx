import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import {
  ProjetFabWithEncadrants,
  getAllProjetsFab,
  getProjetFabById,
  createProjetFab,
  updateProjetFab,
  deleteProjetFab
} from '../services/projetFabService';

interface ProjetFabContextType {
  projetsFab: ProjetFabWithEncadrants[];
  loading: boolean;
  error: string | null;
  getAllProjetsFab: () => Promise<void>;
  getProjetFabById: (id: string) => Promise<any>;
  createProjetFab: (data: FormData) => Promise<any>;
  updateProjetFab: (id: string, data: any) => Promise<any>;
  deleteProjetFab: (id: string) => Promise<any>;
  refreshData: () => Promise<void>;
}

const ProjetFabContext = createContext<ProjetFabContextType | undefined>(undefined);

export const useProjetFab = () => {
  const context = useContext(ProjetFabContext);
  if (context === undefined) {
    throw new Error('useProjetFab must be used within a ProjetFabProvider');
  }
  return context;
};

interface ProjetFabProviderProps {
  children: ReactNode;
}

export const ProjetFabProvider: React.FC<ProjetFabProviderProps> = ({ children }) => {
  const [projetsFab, setProjetsFab] = useState<ProjetFabWithEncadrants[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAllProjetsFab = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      const response = await getAllProjetsFab();
      setProjetsFab(response.data);
    } catch (err) {
      console.error('Error fetching projets fab:', err);
      setError('Erreur lors du chargement des projets de fabrication');
    } finally {
      setLoading(false);
    }
  };

  const fetchProjetFabById = async (id: string): Promise<any> => {
    try {
      const response = await getProjetFabById(id);
      return response;
    } catch (err) {
      console.error(`Error fetching projet fab ${id}:`, err);
      throw err;
    }
  };

  const createNewProjetFab = async (data: FormData): Promise<any> => {
    try {
      const response = await createProjetFab(data);
      // Refresh data after creation
      await fetchAllProjetsFab();
      return response;
    } catch (err) {
      console.error('Error creating projet fab:', err);
      throw err;
    }
  };

  const updateExistingProjetFab = async (id: string, data: any): Promise<any> => {
    try {
      const response = await updateProjetFab(id, data);
      // Refresh data after update
      await fetchAllProjetsFab();
      return response;
    } catch (err) {
      console.error(`Error updating projet fab ${id}:`, err);
      throw err;
    }
  };

  const removeProjetFab = async (id: string): Promise<any> => {
    try {
      const response = await deleteProjetFab(id);
      // Refresh data after deletion
      await fetchAllProjetsFab();
      return response;
    } catch (err) {
      console.error(`Error deleting projet fab ${id}:`, err);
      throw err;
    }
  };


  const refreshData = async (): Promise<void> => {
    await fetchAllProjetsFab();
  };

  useEffect(() => {
    fetchAllProjetsFab();
  }, []);

  const value = {
    projetsFab,
    loading,
    error,
    getAllProjetsFab: fetchAllProjetsFab,
    getProjetFabById: fetchProjetFabById,
    createProjetFab: createNewProjetFab,
    updateProjetFab: updateExistingProjetFab,
    deleteProjetFab: removeProjetFab,
    refreshData,
  };

  return (
    <ProjetFabContext.Provider value={value}>
      {children}
    </ProjetFabContext.Provider>
  );
};

export default ProjetFabContext;