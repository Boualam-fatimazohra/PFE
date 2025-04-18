import * as React from 'react';
import { createContext, useState, useContext, useEffect, useCallback, ReactNode } from 'react';
import { Formateur, Formation, Beneficiaire, Fab} from '@/components/formation-modal/types'
import * as FabService from '../services/FablabService';
import { useAuth } from './AuthContext'; // Assuming you have an AuthContext

// Define interfaces
interface FabContextType {
  Fabs: Fab[];
  selectedFab:Fab | null;
  FabFormateurs: Formateur[];
  FabFormations: Formation[];
  FabBeneficiaires: Beneficiaire[];
  FabBeneficiairesCount: number;
  loading: boolean;
  error: string | null;
  fetchFabs: () => Promise<void>;
  fetchFabById: (id: string) => Promise<Fab | null>;
  createFab: (FabData: { ville: string }) => Promise<any>;
  deleteFab: (id: string) => Promise<boolean>;
  fetchFabFormateurs: () => Promise<any>;
  fetchFabFormations: () => Promise<any>;
  fetchFabBeneficiaires: () => Promise<any>;
  // Updated return type to match the implementation
  fetchBeneficiairesCountByFormation: (formationId: string) => Promise<{ total: number, confirmed: number }>;
  setSelectedFab: (Fab: Fab | null) => void;
}

// Create the context with a default value
const FablabContext = createContext<FabContextType | undefined>(undefined);
const FormationContext = createContext<FabContextType | undefined>(undefined);

export const useFormations = (): FabContextType => {
  const context = useContext(FormationContext);
  if (!context) {
    throw new Error('useFormations doit être utilisé dans un FormationProvider');
  }
  return context;
};
// Provider props interface
interface FabProviderProps {
  children: ReactNode;
}

// Custom hook to use the context
export const useFab = () => {
  const context = useContext(FablabContext);
  if (context === undefined) {
    throw new Error('useFab must be used within an FabProvider');
  }
  return context;
};

// Provider component
export const FabProvider: React.FC<FabProviderProps> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  
  // State variables
  const [Fabs, setFabs] = useState<Fab[]>([]);
  const [selectedFab, setSelectedFab] = useState<Fab | null>(null);
  const [FabFormateurs, setFabFormateurs] = useState<Formateur[]>([]);
  const [FabFormations, setFabFormations] = useState<Formation[]>([]);
  const [FabBeneficiaires, setFabBeneficiaires] = useState<Beneficiaire[]>([]);
  const [FabBeneficiairesCount, setFabBeneficiairesCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBeneficiairesCountByFormation = useCallback(async (id: string): Promise<{ total: number, confirmed: number }> => {
    if (!isAuthenticated) return { total: 0, confirmed: 0 };
    
    try {
      const data = await FabService.getNbrBeneficiairesByFormation(id);
      return { 
        total: data.count || 0, 
        confirmed: data.confirmedCount || 0 
      };
    } catch (err: any) {
      console.error(`Error fetching beneficiaries count for formation ${id}:`, err);
      return { total: 0, confirmed: 0 };
    }
  }, [isAuthenticated]);
  
  // Fetch all Fabs
  const fetchFabs = useCallback(async () => {
    if (!isAuthenticated) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const data = await FabService.getAllFabs();
      setFabs(data);
    } catch (err: any) {
      console.error('Error fetching Fabs:', err);
      setError(err.message || 'Failed to fetch Fabs');
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  // Fetch Fab by ID
  const fetchFabById = useCallback(async (id: string) => {
    if (!isAuthenticated || !id) return null;
    
    setLoading(true);
    setError(null);
    
    try {
      const data = await FabService.getFabById(id);
      setSelectedFab(data);
      return data;
    } catch (err: any) {
      console.error(`Error fetching Fab ${id}:`, err);
      setError(err.message || 'Failed to fetch Fab');
      return null;
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  // Create a new Fab
  const createFab = useCallback(async (FabData: { ville: string }) => {
    if (!isAuthenticated) return null;
    
    setLoading(true);
    setError(null);
    
    try {
      const data = await FabService.createFab(FabData);
      setFabs(prevFabs => [...prevFabs, data.Fab]);
      return data;
    } catch (err: any) {
      console.error('Error creating Fab:', err);
      setError(err.message || 'Failed to create Fab');
      return null;
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  // Delete an FAB
  const deleteFab = useCallback(async (id: string) => {
    if (!isAuthenticated || !id) return false;
    
    setLoading(true);
    setError(null);
    
    try {
      await FabService.deleteFab(id);
      setFabs(prevFabs => prevFabs.filter(Fab => Fab._id !== id));
      return true;
    } catch (err: any) {
      console.error(`Error deleting Fab ${id}:`, err);
      setError(err.message || 'Failed to delete Fab');
      return false;
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  // Fetch FAB formateurs
  const fetchFabFormateurs = useCallback(async () => {
    if (!isAuthenticated) return null;
    
    setLoading(true);
    setError(null);
    
    try {
      const data = await FabService.getFormateursFab();
      if (data && data.data) {
        setFabFormateurs(data.data);
      }
      return data;
    } catch (err: any) {
      console.error('Error fetching Fab formateurs:', err);
      setError(err.message || 'Failed to fetch Fab formateurs');
      return null;
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  // Fetch Fab formations
  const fetchFabFormations = useCallback(async () => {
    if (!isAuthenticated) return null;
    
    setLoading(true);
    setError(null);
    
    try {
      const data = await FabService.getFormationsFab();
      if (data && data.data) {
        setFabFormations(data.data);
      }
      return data;
    } catch (err: any) {
      console.error('Error fetching Fab formations:', err);
      setError(err.message || 'Failed to fetch Fab formations');
      return null;
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  // Fetch Fab beneficiaires
  const fetchFabBeneficiaires = useCallback(async () => {
    if (!isAuthenticated) return null;
    
    setLoading(true);
    setError(null);
    
    try {
      const data = await FabService.getBeneficiairesFab();
      if (data && data.data) {
        setFabBeneficiaires(data.data);
        setFabBeneficiairesCount(data.count || 0);
      }
      return data;
    } catch (err: any) {
      console.error('Error fetching Fab beneficiaires:', err);
      setError(err.message || 'Failed to fetch Fab beneficiaires');
      return null;
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  // Load Fabs on component mount if authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchFabs();
    }
  }, [isAuthenticated, fetchFabs]);

  // Context value
  const value: FabContextType = {
    Fabs,
    selectedFab,
    FabFormateurs,
    FabFormations,
    FabBeneficiaires,
    FabBeneficiairesCount,
    loading,
    error,
    fetchFabs,
    fetchFabById,
    createFab,
    deleteFab,
    fetchFabFormateurs,
    fetchFabFormations,
    fetchFabBeneficiaires,
    setSelectedFab,
    fetchBeneficiairesCountByFormation
  };

  return (
    <FablabContext.Provider value={value}>
      {children}
    </FablabContext.Provider>
  );
};

export default FablabContext;