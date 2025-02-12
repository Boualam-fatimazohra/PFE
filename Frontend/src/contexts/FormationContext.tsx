import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { fetchFormations } from '../services/api'; // Fonction pour récupérer les formations

// Définir le type des formations
interface Formation {
  _id: string;
  nom: string;
  dateDebut: string;
  dateFin: string;
  status: "En Cours" | "Terminer" | "Replanifier"; // Type union des statuts
}

// Définir le type pour le contexte
interface FormationContextType {
  formations: Formation[];
  loading: boolean;
}

// Définir les props du provider
interface FormationProviderProps {
  children: ReactNode;
}

// Créer le contexte avec un type par défaut
const FormationContext = createContext<FormationContextType | undefined>(undefined);

// Fournir le contexte aux composants enfants
export const FormationProvider: React.FC<FormationProviderProps> = ({ children }) => {
  const [formations, setFormations] = useState<Formation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const getFormations = async () => {
      try {
        const data = await fetchFormations(); 

        // Cast des statuts pour correspondre à l'union type
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const formationsWithCorrectStatus = data.map((formation: any) => ({
          ...formation,
          status: formation.status as "En Cours" | "Terminer" | "Replanifier", // Casting explicite
        }));

        setFormations(formationsWithCorrectStatus);
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
  return context;
};