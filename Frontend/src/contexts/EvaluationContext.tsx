import { createContext, useContext, useState, ReactNode } from 'react';
import { createEvaluation, getAllEvaluations, getEvaluationById, updateEvaluation, deleteEvaluation } from '@/services/evaluationService';

// Define the shape of the evaluation data
interface Evaluation {
  _id?: string;
  formationTitle: string;
  formation: string;
  dateDebut?: string;
  dateFin?: string;
  formateur?: string;
  nombreParticipants?: number;
  parametres: {
    anonymousResponses: boolean;
    responseDeadline: boolean;
    responseDeadlineDate?: string | null;
  };
  statut: string;
  dateCreation: Date;
}

// Define the context shape
interface EvaluationContextType {
  evaluations: Evaluation[];
  loading: boolean;
  error: string | null;
  fetchEvaluations: () => Promise<void>;
  getEvaluation: (id: string) => Promise<Evaluation | undefined>;
  addNewEvaluation: (evaluationData: any) => Promise<void>;
  updateExistingEvaluation: (id: string, evaluationData: any) => Promise<void>;
  removeEvaluation: (id: string) => Promise<void>;
}

// Create the context
const EvaluationContext = createContext<EvaluationContextType | undefined>(undefined);

// Hook to use the evaluation context
export const useEvaluation = (): EvaluationContextType => {
  const context = useContext(EvaluationContext);
  if (context === undefined) {
    throw new Error('useEvaluation doit être utilisé à lintérieur de EvaluationProvider');
  }
  return context;
};

// Provider component
export const EvaluationProvider = ({ children }: { children: ReactNode }) => {
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch all evaluations
  const fetchEvaluations = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllEvaluations();
      setEvaluations(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      console.error('Erreur lors de la récupération des évaluations:', err);
    } finally {
      setLoading(false);
    }
  };

  // Get a single evaluation by ID
  const getEvaluation = async (id: string) => {
    try {
      const evaluation = await getEvaluationById(id);
      return evaluation;
    } catch (err) {
      console.error('Erreur lors de la récupération de l\'évaluation:', err);
      return undefined;
    }
  };

  // Add a new evaluation
  const addNewEvaluation = async (evaluationData: any) => {
    try {
      setLoading(true);
      setError(null);
      const response = await createEvaluation(evaluationData);
      setEvaluations(prev => [...prev, response.evaluation]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la création de l\'évaluation');
      throw err; // Re-throw to handle in the component
    } finally {
      setLoading(false);
    }
  };

  // Update an existing evaluation
  const updateExistingEvaluation = async (id: string, evaluationData: any) => {
    try {
      setLoading(true);
      setError(null);
      const response = await updateEvaluation(id, evaluationData);
      setEvaluations(prev => 
        prev.map(evaluation => evaluation._id === id ? response.evaluation : evaluation)
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la mise à jour de l\'évaluation');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Delete an evaluation
  const removeEvaluation = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      await deleteEvaluation(id);
      setEvaluations(prev => prev.filter(evaluation => evaluation._id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la suppression de l\'évaluation');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    evaluations,
    loading,
    error,
    fetchEvaluations,
    getEvaluation,
    addNewEvaluation,
    updateExistingEvaluation,
    removeEvaluation
  };

  return (
    <EvaluationContext.Provider value={value}>
      {children}
    </EvaluationContext.Provider>
  );
};