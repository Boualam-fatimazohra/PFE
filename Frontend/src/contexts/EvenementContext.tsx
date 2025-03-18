import { createContext, useCallback, useContext, useState, useEffect, ReactNode } from "react";
import {
  getEventsCountByRole,
} from "../services/evenementService";
import { getNbrEvenementsAssocies } from '../services/formateurService.js';

interface Evenement {
  _id: string;
  dateDebut: Date;
  dateFin: Date;
  heureDebut: string;
  heureFin: string;
  titre: string;
  description?: string;
  categorie?: string;
  createdBy: string;
  organisateur: string;
  isValidate: boolean;
}

interface EventsCountByRole {
  totalEvents: number;
  validatedEvents: number;
  nonValidatedEvents: number;
}

interface EvenementsStats {
  count: number;
  prochainEvenement: {
    titre: string;
    date: string; // Format ISO 8601
    heure: string; // Format HH:mm
  } | null;
}

interface EvenementContextType {
  evenements: Evenement[];
  mesEvenements: Evenement[];
  evenementsByMonth: { countInMonth: number; totalCount: number };
  eventsCountByRole: EventsCountByRole | null;
  loading: boolean;
  error: string | null;
  fetchEventsCountByRole: () => Promise<void>;
  // New properties from EvenementsAssociesContext
  statsAssocies: EvenementsStats | null;
  isLoadingEvenementsAssocies: boolean;
  errorAssocies: Error | null;
  fetchEvenementsAssocies: () => Promise<void>;
}

const EvenementContext = createContext<EvenementContextType | undefined>(undefined);

export const EvenementProvider = ({ children }: { children: ReactNode }) => {
  const [evenements, setEvenements] = useState<Evenement[]>([]);
  const [mesEvenements, setMesEvenements] = useState<Evenement[]>([]);
  const [evenementsByMonth, setEvenementsByMonth] = useState<{
    countInMonth: number;
    totalCount: number;
  }>({ countInMonth: 0, totalCount: 0 });
  const [eventsCountByRole, setEventsCountByRole] = useState<EventsCountByRole | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // New states from EvenementsAssociesContext
  const [statsAssocies, setStatsAssocies] = useState<EvenementsStats | null>(null);
  const [isLoadingEvenementsAssocies, setIsLoadingEvenementsAssocies] = useState(false);
  const [errorAssocies, setErrorAssocies] = useState<Error | null>(null);

  const fetchEventsCountByRole = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getEventsCountByRole();
      console.log("Data received:", data);
      setEventsCountByRole(data);
      setError(null);
    } catch (error) {
      console.error("Error fetching events count by role:", error);
      setError("Erreur lors de la récupération des statistiques des événements");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchEvenementsAssocies = useCallback(async () => {
    setIsLoadingEvenementsAssocies(true);
    try {
      const data = await getNbrEvenementsAssocies();
      setStatsAssocies(data);
      setErrorAssocies(null);
    } catch (err) {
      setErrorAssocies(err as Error);
      setStatsAssocies(null);
    } finally {
      setIsLoadingEvenementsAssocies(false);
    }
  }, []);

  useEffect(() => {
    fetchEventsCountByRole();
    fetchEvenementsAssocies();
  }, [fetchEventsCountByRole, fetchEvenementsAssocies]);

  return (
    <EvenementContext.Provider
      value={{
        evenements,
        mesEvenements,
        evenementsByMonth,
        eventsCountByRole,
        loading,
        error,
        fetchEventsCountByRole,
        // New properties from EvenementsAssociesContext
        statsAssocies,
        isLoadingEvenementsAssocies,
        errorAssocies,
        fetchEvenementsAssocies,
      }}
    >
      {children}
    </EvenementContext.Provider>
  );
};

export const useEvenement = (): EvenementContextType => {
  const context = useContext(EvenementContext);
  if (!context) {
    throw new Error("useEvenement must be used within an EvenementProvider");
  }
  return context;
};