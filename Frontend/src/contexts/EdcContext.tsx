import * as React from 'react';
import { createContext, useState, useContext, useEffect, useCallback, ReactNode } from 'react';
import { Formateur, Formation, Beneficiaire, EDC} from '@/components/formation-modal/types'
import * as edcService from '../services/edcService';
import { useAuth } from './AuthContext'; // Assuming you have an AuthContext

// Define interfaces
interface EdcContextType {
  edcs: EDC[];
  selectedEdc: EDC | null;
  edcFormateurs: Formateur[];
  edcFormations: Formation[];
  edcBeneficiaires: Beneficiaire[];
  loading: boolean;
  error: string | null;
  fetchEdcs: () => Promise<void>;
  fetchEdcById: (id: string) => Promise<EDC | null>;
  createEdc: (edcData: { ville: string }) => Promise<any>;
  deleteEdc: (id: string) => Promise<boolean>;
  fetchEdcFormateurs: () => Promise<any>;
  fetchEdcFormations: () => Promise<any>;
  fetchEdcBeneficiaires: () => Promise<any>;
  setSelectedEdc: (edc: EDC | null) => void;
}

// Create the context with a default value
const EdcContext = createContext<EdcContextType | undefined>(undefined);

// Provider props interface
interface EdcProviderProps {
  children: ReactNode;
}

// Custom hook to use the context
export const useEdc = () => {
  const context = useContext(EdcContext);
  if (context === undefined) {
    throw new Error('useEdc must be used within an EdcProvider');
  }
  return context;
};

// Provider component
export const EdcProvider: React.FC<EdcProviderProps> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  
  // State variables
  const [edcs, setEdcs] = useState<EDC[]>([]);
  const [selectedEdc, setSelectedEdc] = useState<EDC | null>(null);
  const [edcFormateurs, setEdcFormateurs] = useState<Formateur[]>([]);
  const [edcFormations, setEdcFormations] = useState<Formation[]>([]);
  const [edcBeneficiaires, setEdcBeneficiaires] = useState<Beneficiaire[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch all EDCs
  const fetchEdcs = useCallback(async () => {
    if (!isAuthenticated) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const data = await edcService.getAllEDCs();
      setEdcs(data);
    } catch (err: any) {
      console.error('Error fetching EDCs:', err);
      setError(err.message || 'Failed to fetch EDCs');
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  // Fetch EDC by ID
  const fetchEdcById = useCallback(async (id: string) => {
    if (!isAuthenticated || !id) return null;
    
    setLoading(true);
    setError(null);
    
    try {
      const data = await edcService.getEDCById(id);
      setSelectedEdc(data);
      return data;
    } catch (err: any) {
      console.error(`Error fetching EDC ${id}:`, err);
      setError(err.message || 'Failed to fetch EDC');
      return null;
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  // Create a new EDC
  const createEdc = useCallback(async (edcData: { ville: string }) => {
    if (!isAuthenticated) return null;
    
    setLoading(true);
    setError(null);
    
    try {
      const data = await edcService.createEDC(edcData);
      setEdcs(prevEdcs => [...prevEdcs, data.edc]);
      return data;
    } catch (err: any) {
      console.error('Error creating EDC:', err);
      setError(err.message || 'Failed to create EDC');
      return null;
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  // Delete an EDC
  const deleteEdc = useCallback(async (id: string) => {
    if (!isAuthenticated || !id) return false;
    
    setLoading(true);
    setError(null);
    
    try {
      await edcService.deleteEDC(id);
      setEdcs(prevEdcs => prevEdcs.filter(edc => edc._id !== id));
      return true;
    } catch (err: any) {
      console.error(`Error deleting EDC ${id}:`, err);
      setError(err.message || 'Failed to delete EDC');
      return false;
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  // Fetch EDC formateurs
  const fetchEdcFormateurs = useCallback(async () => {
    if (!isAuthenticated) return null;
    
    setLoading(true);
    setError(null);
    
    try {
      const data = await edcService.getFormateursEdc();
      if (data && data.data) {
        setEdcFormateurs(data.data);
      }
      return data;
    } catch (err: any) {
      console.error('Error fetching EDC formateurs:', err);
      setError(err.message || 'Failed to fetch EDC formateurs');
      return null;
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  // Fetch EDC formations
  const fetchEdcFormations = useCallback(async () => {
    if (!isAuthenticated) return null;
    
    setLoading(true);
    setError(null);
    
    try {
      const data = await edcService.getFormationsEdc();
      if (data && data.data) {
        setEdcFormations(data.data);
      }
      return data;
    } catch (err: any) {
      console.error('Error fetching EDC formations:', err);
      setError(err.message || 'Failed to fetch EDC formations');
      return null;
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  // Fetch EDC beneficiaires
  const fetchEdcBeneficiaires = useCallback(async () => {
    if (!isAuthenticated) return null;
    
    setLoading(true);
    setError(null);
    
    try {
      const data = await edcService.getBeneficiairesEdc();
      if (data && data.data) {
        setEdcBeneficiaires(data.data);
      }
      return data;
    } catch (err: any) {
      console.error('Error fetching EDC beneficiaires:', err);
      setError(err.message || 'Failed to fetch EDC beneficiaires');
      return null;
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  // Load EDCs on component mount if authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchEdcs();
    }
  }, [isAuthenticated, fetchEdcs]);

  // Context value
  const value: EdcContextType = {
    edcs,
    selectedEdc,
    edcFormateurs,
    edcFormations,
    edcBeneficiaires,
    loading,
    error,
    fetchEdcs,
    fetchEdcById,
    createEdc,
    deleteEdc,
    fetchEdcFormateurs,
    fetchEdcFormations,
    fetchEdcBeneficiaires,
    setSelectedEdc
  };

  return (
    <EdcContext.Provider value={value}>
      {children}
    </EdcContext.Provider>
  );
};

export default EdcContext;