import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getAllFormations as fetchFormations, createFormation as addFormation } from '../services/formationService';
import { deleteFormation as apiDeleteFormation, updateFormation as ipUpdateFormation } from '../services/formationService';
import {getNbrBeneficiairesParFormateur} from "../services/formationService";
interface Formation {
  _id?: string;
  nom: string;
  dateDebut: string;
  dateFin: string;
  lienInscription: string;
  tags: string;
  status?: "En Cours" | "Terminer" | "Replanifier";
  image?: File | string; // include image url
}

interface FormationContextType {
  formations: Formation[];
  loading: boolean;
  error: string | null;
  addNewFormation: (formationData: Formation) => Promise<void>;
  deleteFormation: (id: string) => Promise<void>;
  updateFormation: (id: string, formationData: Partial<Formation>) => Promise<void>;
  refreshFormations: () => Promise<void>;
  nombreBeneficiaires: number | null; // Ajoutez par saloua
}

interface FormationProviderProps {
  children: ReactNode;
}

const FormationContext = createContext<FormationContextType | undefined>(undefined);

export const FormationProvider: React.FC<FormationProviderProps> = ({ children }) => {
  const [formations, setFormations] = useState<Formation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [nombreBeneficiaires, setNombreBeneficiaires] = useState<number | null>(null); // Nouvel état
  const fetchNombreBeneficiaires = async () => {
    try {
      setError(null);
      const data = await getNbrBeneficiairesParFormateur();
      setNombreBeneficiaires(data.nombreBeneficiaires);
      return data.nombreBeneficiaires;
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : "Erreur lors de la récupération du nombre de bénéficiaires";
      console.error(errorMessage);
      setError(errorMessage);
      throw error;
    }
  };
  useEffect(() => {
    const getFormations = async () => {
      try {
        setLoading(true);
        
        // Chargement parallèle des formations et du nombre de bénéficiaires
        const [formationsData, beneficiairesData] = await Promise.all([
          fetchFormations(),
          getNbrBeneficiairesParFormateur()
        ]);
        
        setFormations(formationsData);
        setNombreBeneficiaires(beneficiairesData.nombreBeneficiaires);
        setError(null);
      } catch (error) {
        console.error('Erreur lors du chargement des données', error);
        setError('Impossible de charger les données');
      } finally {
        setLoading(false);
      }
    };

    getFormations();
    fetchNombreBeneficiaires();
  }, []);
  const refreshFormations = async () => {
    setLoading(true);
    try {
      const data = await fetchFormations();
      setFormations(data);
      setError(null);
    } catch (error) {
      setError('Failed to refresh formations');
    } finally {
      setLoading(false);
    }
  };

// In FormationContext.tsx, update the addFormation function
const addNewFormation = async (formationData: Formation) => {
  try {
    setError(null);
    
    // Call the API function directly with the formation data
    // The service function will handle creating the FormData internally
    const response = await addFormation(formationData);
    
    // Update state with the new formation
    setFormations((prevFormations) => [...prevFormations, response.formation]);
    
    return response.formation;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Erreur lors de l'ajout de la formation";
    console.error(errorMessage);
    setError(errorMessage);
    throw error;
  }
};

  const deleteFormation = async (id: string) => {
    try {
      setError(null);
      // Call the API to delete the formation
      await apiDeleteFormation(id);
      
      // Update the local state by removing the deleted formation
      setFormations((prevFormations) => 
        prevFormations.filter((formation) => formation._id !== id)
      );
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : "Erreur lors de la suppression de la formation";
      console.error(errorMessage);
      setError(errorMessage);
      throw error;
    }
  };

  // Add this function for updating formations
  const updateFormation = async (id: string, formationData: Partial<Formation>) => {
    try {
      setError(null);
      // Call the API to update the formation
      const updatedFormation = await ipUpdateFormation(id, formationData);
      
      // Update the formations list with the updated formation
      setFormations((prevFormations) => 
        prevFormations.map((formation) => 
          formation._id === id ? { ...formation, ...updatedFormation } : formation
        )
      );
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : "Erreur lors de la mise à jour de la formation";
      console.error(errorMessage);
      setError(errorMessage);
      throw error;
    }
  };

  return (
    <FormationContext.Provider value={{ formations, loading, error, addNewFormation, deleteFormation, updateFormation, refreshFormations ,nombreBeneficiaires,}}>
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