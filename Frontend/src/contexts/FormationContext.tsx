import  { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { fetchFormations } from '../services/api'; // Fonction pour récupérer les formations

// Définir le type pour les données du contexte
interface FormationContextType {
  formations: Formation[];
  loading: boolean;
}

// Définir le type des props du provider (pour enfants)
interface FormationProviderProps {
  children: ReactNode;
}

// Définir le type pour une formation
interface Formation {
  _id: string;
  title: string;
  dateDebut: string;
  dateFin: string;
  status: string;
}

// Créer le contexte avec un type par défaut
const FormationContext = createContext<FormationContextType | undefined>(undefined);
// Fournir le contexte aux composants enfants
export const FormationProvider: React.FC<FormationProviderProps> = ({ children }) : JSX.Element => {
      const [formations, setFormations] = useState<Formation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const getFormations = async () => {
      try {
        const data = await fetchFormations(); // Appel à l'API pour récupérer les formations
        setFormations(data);
      } catch (error) {
        console.error('Erreur de récupération des formations', error);
      } finally {
        setLoading(false);
      }
    };

    getFormations();
  }, []);

  return (
    <FormationContext.Provider value={{ formations, loading }}>
      {children}
    </FormationContext.Provider>
  );
};

// Hook personnalisé pour accéder aux données du contexte
export const useFormations = (): FormationContextType => {
  const context = useContext(FormationContext);
  if (!context) {
    throw new Error('useFormations doit être utilisé dans un FormationProvider');
  }
  return context;
};
