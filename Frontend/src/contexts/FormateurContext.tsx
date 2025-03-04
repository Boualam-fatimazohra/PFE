/* eslint-disable @typescript-eslint/no-explicit-any */
// contexts/EvenementsContext.tsx
import  { createContext, useContext, useEffect, useState } from 'react';
import { getNbrEvenementsAssocies } from '../services/formateurService.js';

interface EvenementsStats {
  total: number;
  parType: {
    formateur: number;
    coordinateur: number;
  };
  prochainEvenement: any | null; // Remplacez "any" par votre interface d'événement si disponible
}

interface EvenementsContextType {
  stats: EvenementsStats | null;
  isLoadingEvenements: boolean;
  error: Error | null;
  fetchEvenements: () => Promise<void>;
}

const EvenementsAssociesContext = createContext<EvenementsContextType>({
  stats: null,
  isLoadingEvenements: false,
  error: null,
  fetchEvenements: async () => {},
});

export const EvenementsAssociesProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [stats, setStats] = useState<EvenementsStats | null>(null);
  const [isLoadingEvenements, setIsLoadingEvenements] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchEvenements = async () => {
    setIsLoadingEvenements(true);
    try {
      const data = await getNbrEvenementsAssocies();
      setStats(data);
      setError(null);
    } catch (err) {
      setError(err as Error);
      setStats(null);
    } finally {
      setIsLoadingEvenements(false);
    }
  };

  useEffect(() => {
    fetchEvenements();
  }, []);

  return (
    <EvenementsAssociesContext.Provider 
      value={{ stats, isLoadingEvenements, error, fetchEvenements }}
    >
      {children}
    </EvenementsAssociesContext.Provider>
  );
};

export const useEvenementsAssocies = () => {
  const context = useContext(EvenementsAssociesContext);
  if (!context) {
    throw new Error('useEvenementsAssocies must be used within a EvenementsAssociesProvider');
  }
  return context;
};