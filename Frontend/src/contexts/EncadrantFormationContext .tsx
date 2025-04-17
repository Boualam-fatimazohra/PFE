import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { 
  FormationWithEncadrants, 
  listFormationsWithEncadrants as fetchFormationsWithEncadrants,
  assignEncadrantToFormation as apiAssignEncadrantToFormation,
  deleteAssignment as apiDeleteAssignment,
  getFormationsByEncadrant as apiFetchFormationsByEncadrant,
  getEncadrantsByFormation as apiFetchEncadrantsByFormation,
} from '../services/encadrantFormationService';

interface EncadrantFormationContextType {
  formationsWithEncadrants: FormationWithEncadrants[];
  loading: boolean;
  error: string | null;
  listFormationsWithEncadrants: () => Promise<void>;
  assignEncadrantToFormation: (encadrantId: string, formationBaseId: string, dateAssignment?: Date) => Promise<void>;
  deleteAssignment: (assignmentId: string) => Promise<void>;
  getFormationsByEncadrant: (encadrantId: string) => Promise<any>;
  getEncadrantsByFormation: (formationId: string) => Promise<any>;
  refreshData: () => Promise<void>;
}

const EncadrantFormationContext = createContext<EncadrantFormationContextType | undefined>(undefined);

export const useEncadrantFormation = () => {
  const context = useContext(EncadrantFormationContext);
  if (context === undefined) {
    throw new Error('useEncadrantFormation must be used within an EncadrantFormationProvider');
  }
  return context;
};

interface EncadrantFormationProviderProps {
  children: ReactNode;
}

export const EncadrantFormationProvider: React.FC<EncadrantFormationProviderProps> = ({ children }) => {
  const [formationsWithEncadrants, setFormationsWithEncadrants] = useState<FormationWithEncadrants[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const listFormationsWithEncadrants = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetchFormationsWithEncadrants();
      setFormationsWithEncadrants(response.data);
    } catch (err) {
      console.error('Error fetching formations with encadrants:', err);
      setError('Erreur lors du chargement des formations avec encadrants');
    } finally {
      setLoading(false);
    }
  };

  const assignEncadrantToFormation = async (encadrantId: string, formationBaseId: string, dateAssignment?: Date): Promise<void> => {
    try {
      await apiAssignEncadrantToFormation(encadrantId, formationBaseId, dateAssignment);
      // Refresh data after assignment
      await listFormationsWithEncadrants();
    } catch (err) {
      console.error('Error assigning encadrant to formation:', err);
      throw err;
    }
  };

  const deleteAssignment = async (assignmentId: string): Promise<void> => {
    try {
      await apiDeleteAssignment(assignmentId);
      // Refresh data after deletion
      await listFormationsWithEncadrants();
    } catch (err) {
      console.error('Error deleting assignment:', err);
      throw err;
    }
  };

  const getFormationsByEncadrant = async (encadrantId: string): Promise<any> => {
    try {
      const response = await apiFetchFormationsByEncadrant(encadrantId);
      return response;
    } catch (err) {
      console.error(`Error fetching formations for encadrant ${encadrantId}:`, err);
      throw err;
    }
  };

  const getEncadrantsByFormation = async (formationId: string): Promise<any> => {
    try {
      const response = await apiFetchEncadrantsByFormation(formationId);
      return response;
    } catch (err) {
      console.error(`Error fetching encadrants for formation ${formationId}:`, err);
      throw err;
    }
  };

  const refreshData = async (): Promise<void> => {
    await listFormationsWithEncadrants();
  };

  useEffect(() => {
    listFormationsWithEncadrants();
  }, []);

  const value = {
    formationsWithEncadrants,
    loading,
    error,
    listFormationsWithEncadrants,
    assignEncadrantToFormation,
    deleteAssignment,
    getFormationsByEncadrant,
    getEncadrantsByFormation,
    refreshData,
  };

  return (
    <EncadrantFormationContext.Provider value={value}>
      {children}
    </EncadrantFormationContext.Provider>
  );
};

export default EncadrantFormationContext;