import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { fetchFormations, addFormation } from '../services/api';

interface Formation {
  _id?: string;
  nom: string;
  dateDebut: string;
  dateFin: string;
  lienInscription: string;
  tags: string;
  status?: "En Cours" | "Terminer" | "Replanifier";
}

interface FormationContextType {
  formations: Formation[];
  loading: boolean;
  error: string | null;
  addNewFormation: (formationData: Formation) => Promise<void>;
}

interface FormationProviderProps {
  children: ReactNode;
}

const FormationContext = createContext<FormationContextType | undefined>(undefined);

export const FormationProvider: React.FC<FormationProviderProps> = ({ children }) => {
  const [formations, setFormations] = useState<Formation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getFormations = async () => {
      try {
        const data = await fetchFormations();
        setFormations(data);
        setError(null);
      } catch (error) {
        console.error('Erreur lors de la récupération des formations', error);
        setError('Impossible de charger les formations');
      } finally {
        setLoading(false);
      }
    };

    getFormations();
  }, []);

  const addNewFormation = async (formationData: Formation) => {
    try {
      setError(null);
      const newFormation = await addFormation(formationData);
      setFormations((prevFormations) => [...prevFormations, newFormation]);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Erreur lors de l'ajout de la formation";
      console.error(errorMessage);
      setError(errorMessage);
      throw error;
    }
  };

  return (
    <FormationContext.Provider value={{ formations, loading, error, addNewFormation }}>
      {children}
    </FormationContext.Provider>
  );
};

export const useFormations = (): FormationContextType => {
  const context = useContext(FormationContext);
  if (!context) {
    throw new Error('useFormations doit être utilisé dans un FormationProvider');
  }
  return context;
};