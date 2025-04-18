import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import {
  Equipement,
  getAllEquipements,
  getEquipementById,
  createEquipement,
  updateEquipement,
  deleteEquipement,
  getEquipementsByFab,
  getEquipementsByEtat
} from '../services/equipementService';

interface EquipementContextType {
  equipements: Equipement[];
  loading: boolean;
  error: string | null;
  getAllEquipements: () => Promise<void>;
  getEquipementById: (id: string) => Promise<any>;
  createEquipement: (data: FormData) => Promise<any>;
  updateEquipement: (id: string, data: any) => Promise<any>;
  deleteEquipement: (id: string) => Promise<any>;
  getEquipementsByFab: (fabId: string) => Promise<any>;
  getEquipementsByEtat: (etat: string) => Promise<any>;
  refreshData: () => Promise<void>;
}

const EquipementContext = createContext<EquipementContextType | undefined>(undefined);

export const useEquipement = () => {
  const context = useContext(EquipementContext);
  if (context === undefined) {
    throw new Error('useEquipement must be used within an EquipementProvider');
  }
  return context;
};

interface EquipementProviderProps {
  children: ReactNode;
}

export const EquipementProvider: React.FC<EquipementProviderProps> = ({ children }) => {
  const [equipements, setEquipements] = useState<Equipement[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAllEquipements = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      const response = await getAllEquipements();
      setEquipements(response.data);
    } catch (err) {
      console.error('Erreur lors du chargement des équipements:', err);
      setError('Erreur lors du chargement des équipements');
    } finally {
      setLoading(false);
    }
  };

  const fetchEquipementById = async (id: string): Promise<any> => {
    try {
      const response = await getEquipementById(id);
      return response;
    } catch (err) {
      console.error(`Erreur lors de la récupération de l'équipement ${id}:`, err);
      throw err;
    }
  };

  const createNewEquipement = async (data: FormData): Promise<any> => {
    try {
      const response = await createEquipement(data);
      // Actualiser les données après création
      await fetchAllEquipements();
      return response;
    } catch (err) {
      console.error('Erreur lors de la création de l\'équipement:', err);
      throw err;
    }
  };

  const updateExistingEquipement = async (id: string, data: any): Promise<any> => {
    try {
      const response = await updateEquipement(id, data);
      // Actualiser les données après mise à jour
      await fetchAllEquipements();
      return response;
    } catch (err) {
      console.error(`Erreur lors de la mise à jour de l'équipement ${id}:`, err);
      throw err;
    }
  };

  const removeEquipement = async (id: string): Promise<any> => {
    try {
      const response = await deleteEquipement(id);
      // Actualiser les données après suppression
      await fetchAllEquipements();
      return response;
    } catch (err) {
      console.error(`Erreur lors de la suppression de l'équipement ${id}:`, err);
      throw err;
    }
  };

  const fetchEquipementsByFab = async (fabId: string): Promise<any> => {
    try {
      const response = await getEquipementsByFab(fabId);
      return response;
    } catch (err) {
      console.error(`Erreur lors de la récupération des équipements par fab ${fabId}:`, err);
      throw err;
    }
  };

  const fetchEquipementsByEtat = async (etat: string): Promise<any> => {
    try {
      const response = await getEquipementsByEtat(etat);
      return response;
    } catch (err) {
      console.error(`Erreur lors de la récupération des équipements par état "${etat}":`, err);
      throw err;
    }
  };

  const refreshData = async (): Promise<void> => {
    await fetchAllEquipements();
  };

  useEffect(() => {
    fetchAllEquipements();
  }, []);

  const value = {
    equipements,
    loading,
    error,
    getAllEquipements: fetchAllEquipements,
    getEquipementById: fetchEquipementById,
    createEquipement: createNewEquipement,
    updateEquipement: updateExistingEquipement,
    deleteEquipement: removeEquipement,
    getEquipementsByFab: fetchEquipementsByFab,
    getEquipementsByEtat: fetchEquipementsByEtat,
    refreshData,
  };

  return (
    <EquipementContext.Provider value={value}>
      {children}
    </EquipementContext.Provider>
  );
};

export default EquipementContext;