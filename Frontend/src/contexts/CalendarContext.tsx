import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getAllFormations } from '../services/formationService';
import { getMesEvenements, Evenement } from '../services/evenementService';

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

// Type definition for calendar events (combines both formations and evenements)
export interface CalendarEvent {
  id: string;
  title: string;
  start: Date | string;
  end: Date | string;
  type: 'Formation' | 'Evenement';
  backgroundColor?: string;
  extendedProps: {
    type: 'Formation' | 'Evenement';
    status?: string;
    location?: string;
    description?: string;
    originalData: Formation | Evenement;
  };
}

interface CalendarContextType {
  events: CalendarEvent[];
  formations: Formation[];
  evenements: Evenement[];
  loading: boolean;
  error: string | null;
  refreshCalendarData: () => Promise<void>;
}

const CalendarContext = createContext<CalendarContextType | undefined>(undefined);

interface CalendarProviderProps {
  children: ReactNode;
}

export const CalendarProvider: React.FC<CalendarProviderProps> = ({ children }) => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [formations, setFormations] = useState<Formation[]>([]);
  const [evenements, setEvenements] = useState<Evenement[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Function to convert formations to calendar events format
  const formatFormationsToEvents = (formations: Formation[]): CalendarEvent[] => {
    return formations.map(formation => ({
      id: `formation-${formation._id}`,
      title: formation.nom,
      start: new Date(formation.dateDebut),
      end: new Date(formation.dateFin),
      type: 'Formation',
      backgroundColor: getStatusColor(formation.status),
      extendedProps: {
        type: 'Formation',
        status: formation.status,
        originalData: formation
      }
    }));
  };

  // Function to convert evenements to calendar events format
  const formatEvenementsToEvents = (evenements: Evenement[]): CalendarEvent[] => {
    return evenements.map(evenement => {
      // Combine date and time for start and end
      const startDate = new Date(evenement.dateDebut);
      const endDate = new Date(evenement.dateFin);
      
      // Parse time strings (assuming format like "14:30")
      if (evenement.heureDebut) {
        const [startHours, startMinutes] = evenement.heureDebut.split(':').map(Number);
        startDate.setHours(startHours, startMinutes);
      }
      
      if (evenement.heureFin) {
        const [endHours, endMinutes] = evenement.heureFin.split(':').map(Number);
        endDate.setHours(endHours, endMinutes);
      }
      
      return {
        id: `evenement-${evenement._id}`,
        title: evenement.sujet,
        start: startDate,
        end: endDate,
        type: 'Evenement',
        backgroundColor: '#FF7900', // Orange color for events
        extendedProps: {
          type: 'Evenement',
          originalData: evenement
        }
      };
    });
  };

  // Helper function to assign colors based on formation status
  const getStatusColor = (status?: string): string => {
    switch (status) {
      case 'En Cours':
        return '#FF7900'; // Orange
      case 'Terminer':
        return '#00C31F'; // Green
      case 'Replanifier':
        return '#9C00C3'; // Purple
      case 'A venir':
        return '#4D4D4D'; // Gray
      default:
        return '#039BE5'; // Default blue
    }
  };

  // Fetch both formations and evenements
  const fetchCalendarData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch data in parallel
      const [formationsData, evenementsData] = await Promise.all([
        getAllFormations(),
        getMesEvenements()
      ]);
      
      setFormations(formationsData);
      setEvenements(evenementsData);
      
      // Combine both types of events
      const formationEvents = formatFormationsToEvents(formationsData);
      const evenementEvents = formatEvenementsToEvents(evenementsData);
      
      setEvents([...formationEvents, ...evenementEvents]);
    } catch (error) {
      console.error('Error fetching calendar data:', error);
      setError('Failed to load calendar data');
    } finally {
      setLoading(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchCalendarData();
  }, []);

  // Function to refresh data
  const refreshCalendarData = async () => {
    await fetchCalendarData();
  };

  return (
    <CalendarContext.Provider 
      value={{ 
        events, 
        formations, 
        evenements, 
        loading, 
        error, 
        refreshCalendarData 
      }}
    >
      {children}
    </CalendarContext.Provider>
  );
};

// Custom hook for using the calendar context
export const useCalendar = (): CalendarContextType => {
  const context = useContext(CalendarContext);
  if (!context) {
    throw new Error('useCalendar must be used within a CalendarProvider');
  }
  return context;
};