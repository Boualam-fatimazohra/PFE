import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import multiMonthPlugin from '@fullcalendar/multimonth';
import { Button } from '@/components/ui/button';
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useFormations } from "@/contexts/FormationContext";

// Styles personnalisés (inchangés)
const calendarStyles = `
  /* Style pour les en-têtes de jour (lun, mar, mer, etc.) */
  .fc .fc-col-header-cell {
    background-color: #f1f1f1;
    padding: 10px 0;
  }
  /* Personnalisation de l'en-tête du calendrier */
.fc .fc-toolbar-title {
    color: #333;
    font-weight: bold;
}

/* Personnalisation de l'arrière-plan de l'en-tête */
.fc .fc-toolbar {
    background-color: #f4f4f4;
    padding: 10px 20px;
}

/* Personnalisation des flèches de navigation */
.fc .fc-button {
    background-color: #EEE;
    color: #333333;
}

.fc .fc-button:hover {
    background-color: #ccc;
}

/* Personnalisation du bouton de vue (Jour, Semaine, Mois, Année) */
.fc .fc-button-active {
    background-color: #FF7900;
    color: white;
}


  .fc .fc-col-header-cell-cushion {
    font-weight: 500;
    color: #666;
    text-transform: capitalize;
  }

  /* Style pour les cellules des jours */
  .fc .fc-daygrid-day {
    transition: background-color 0.2s;
  }

  .fc .fc-daygrid-day:hover {
    background-color: #f9f9f9;
  }

  /* Style pour les événements */
  .fc-event {
    border: none !important;
    border-radius: 4px !important;
    font-size: 0.85em !important;
    padding: 2px 4px !important;
  }
  /* Style pour le jour actuel */
  .fc .fc-day-today {
    background-color: rgba(255, 220, 40, 0.15) !important;
  }
  /* Styles spécifiques pour l'en-tête du calendrier */
  .fc .fc-toolbar {
    margin-bottom: 1em !important;
  }

  /* Style pour le titre du calendrier (mois et année) */
  h2.calendar-title {
    font-weight: 700 !important;
    font-size: 1.25rem !important;
    
  }

  /* Adaptation pour les mobiles */
  @media (max-width: 768px) {
    .fc .fc-daygrid-event {
      font-size: 0.75em !important;
    }
  }
`;

// Événements statiques
const staticEvents = [
  {
    id: '1',
    title: 'Réunion Marketing',
    start: '2025-01-02',
    end: '2025-01-03',
    backgroundColor: '#F16E00',
  },
  {
    id: '2',
    title: 'Team Call',
    start: '2025-01-03',
    end: '2025-01-04',
    backgroundColor: '#2196F3',
  },
  {
    id: '3',
    title: 'Design',
    start: '2025-01-04',
    end: '2025-01-05',
    backgroundColor: '#4CAF50',
  },
  {
    id: '4',
    title: 'Design Brief',
    start: '2025-01-04T16:00:00',
    end: '2025-01-04T17:00:00',
    backgroundColor: '#F16E00',
  }
];

// Cache constants
const STORAGE_KEY = {
  FORMATIONS: 'cached_manager_formations',
  TIMESTAMP: 'cached_manager_formations_timestamp',
  HASH: 'cached_manager_formations_hash'
};
const CACHE_DURATION =  60 * 1000; 

const CalendrierManager = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date(2025, 0, 1));
  const [currentView, setCurrentView] = useState('dayGridMonth');
  const calendarRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [events, setEvents] = useState([...staticEvents]); 
  const [isLoading, setIsLoading] = useState(true);
  const [formationEvents, setFormationEvents] = useState([]);
  const [lastUpdated, setLastUpdated] = useState(null);
  
  const navigate = useNavigate();
  
  const { 
    formations: contextFormations, 
    loading, 
    getAllFormationsManager 
  } = useFormations();

  const generateFormationsHash = useCallback((formations) => {
    return formations
      .map(f => `${f._id}-${f.dateDebut}-${f.dateFin}-${f.nom}-${f.status}`)
      .sort()
      .join('|');
  }, []);

  const convertFormationsToEvents = useCallback((formations) => {
    return formations.map(formation => {
      const startDate = new Date(formation.dateDebut);
      let endDate;
      
      if (formation.dateFin) {
        endDate = new Date(formation.dateFin);
      } else {
        endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + 1); 
      }
      
      return {
        id: `formation-${formation._id}`,
        title: formation.nom,
        start: startDate.toISOString().split('T')[0], 
        end: endDate.toISOString().split('T')[0],
        backgroundColor: '#FFEDD5',
        textColor: '#9A3412',
        extendedProps: {
          type: 'formation',
          status: formation.status,
          formationId: formation._id
        }
      };
    });
  }, []);

  // Fonction pour récupérer les formations depuis le cache ou l'API
  const loadCachedFormations = useCallback(() => {
    try {
      const cachedFormations = localStorage.getItem(STORAGE_KEY.FORMATIONS);
      const cachedTimestamp = localStorage.getItem(STORAGE_KEY.TIMESTAMP);
      
      if (cachedFormations && cachedTimestamp) {
        const parsedFormations = JSON.parse(cachedFormations);
        const timestamp = parseInt(cachedTimestamp);
        
        if (Date.now() - timestamp < CACHE_DURATION) {
          setFormationEvents(parsedFormations);
          setEvents([...staticEvents, ...parsedFormations]);
          setLastUpdated(new Date(timestamp));
          setIsLoading(false);
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error("Erreur lors du chargement du cache:", error);
      return false;
    }
  }, []);

  const updateFormationsCache = useCallback((formations) => {
    try {
      const formationEvents = convertFormationsToEvents(formations);
      const hash = generateFormationsHash(formations);
      
      // Stocker dans le localStorage
      localStorage.setItem(STORAGE_KEY.FORMATIONS, JSON.stringify(formationEvents));
      localStorage.setItem(STORAGE_KEY.TIMESTAMP, Date.now().toString());
      localStorage.setItem(STORAGE_KEY.HASH, hash);
      
      // Mettre à jour l'état
      setFormationEvents(formationEvents);
      setEvents([...staticEvents, ...formationEvents]);
      setLastUpdated(new Date());
    } catch (error) {
      console.error("Erreur lors de la mise à jour du cache:", error);
    }
  }, [convertFormationsToEvents, generateFormationsHash]);

  // Fonction pour charger les formations depuis l'API
  const fetchFormations = useCallback(async (force = false) => {
    // Si on charge déjà depuis le cache et que ce n'est pas forcé, on sort
    if (!force && loadCachedFormations()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      const managerFormations = await getAllFormationsManager();
      
      // Vérifier si les données ont changé par rapport au cache
      const newHash = generateFormationsHash(managerFormations);
      const oldHash = localStorage.getItem(STORAGE_KEY.HASH);
      
      if (newHash !== oldHash) {
        // Les données ont changé, mettre à jour le cache
        updateFormationsCache(managerFormations);
      }
      
      setIsLoading(false);
    } catch (error) {
      console.error("Erreur lors du chargement des formations:", error);
      setIsLoading(false);
      
      // Si erreur, essayer d'utiliser le cache même s'il est expiré
      const cachedFormations = localStorage.getItem(STORAGE_KEY.FORMATIONS);
      if (cachedFormations) {
        const parsedFormations = JSON.parse(cachedFormations);
        setFormationEvents(parsedFormations);
        setEvents([...staticEvents, ...parsedFormations]);
      }
    }
  }, [loadCachedFormations, getAllFormationsManager, generateFormationsHash, updateFormationsCache]);

  // Effet pour charger les formations au montage et configurer un poller
  useEffect(() => {
    // Charger les formations depuis le cache ou l'API
    fetchFormations();
    
    // Configurer un intervalle pour vérifier les mises à jour
    const intervalId = setInterval(() => {
      fetchFormations(true); // Force refresh
    }, CACHE_DURATION);
    
    // Nettoyer l'intervalle au démontage
    return () => clearInterval(intervalId);
  }, [fetchFormations]);

  // Effet pour mettre à jour les événements quand le context change
  useEffect(() => {
    // Si nous avons des formations dans le context et qu'elles ont changé
    if (contextFormations && contextFormations.length > 0) {
      const newHash = generateFormationsHash(contextFormations);
      const oldHash = localStorage.getItem(STORAGE_KEY.HASH);
      
      if (newHash !== oldHash) {
        updateFormationsCache(contextFormations);
      }
    }
  }, [contextFormations, generateFormationsHash, updateFormationsCache]);

  // Gestionnaire d'événements pour la création
  const handleSelection = (type) => {
    setOpen(false);
    if (type === "event") {
      navigate("/manager/CreatEvent");
    } else if (type === "formation") {
      navigate("/formateur/formationModal");
    }
  };
  
  // Fonction pour formater le mois et l'année
  const formatMonthYear = (date) => {
    const monthYear = new Intl.DateTimeFormat('fr-FR', {
      month: 'long',
      year: 'numeric'
    }).format(date);
    
    return monthYear.charAt(0).toUpperCase() + monthYear.slice(1).toLowerCase();
  };
  
  // Navigation entre les dates
  const navigateDate = (direction) => {
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      if (direction === 'next') {
        calendarApi.next();
      } else {
        calendarApi.prev();
      }
      setCurrentMonth(calendarApi.getDate());
    }
  };
  
  // Changement de vue
  const changeView = (viewName) => {
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      calendarApi.changeView(viewName);
      setCurrentView(viewName);
    }
  };
  
  // Synchroniser le titre avec la vue
  useEffect(() => {
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      setCurrentMonth(calendarApi.getDate());
    }
  }, [currentView]);
  
  // Obtenir le titre approprié selon la vue courante
  const getTitle = () => {
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      const currentDate = calendarApi.getDate();
      
      switch (currentView) {
        case 'timeGridDay':
          return new Intl.DateTimeFormat('fr-FR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
          }).format(currentDate);
        case 'timeGridWeek':
          const startDate = calendarApi.view.currentStart;
          const endDate = calendarApi.view.currentEnd;
          const startFormatted = new Intl.DateTimeFormat('fr-FR', {
            day: 'numeric'
          }).format(startDate);
          const endFormatted = new Intl.DateTimeFormat('fr-FR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
          }).format(new Date(endDate.getTime() - 86400000));
          return `${startFormatted} - ${endFormatted}`;
        case 'multiMonthYear':
          return new Intl.DateTimeFormat('fr-FR', {
            year: 'numeric'
          }).format(currentDate);
        default:
          return formatMonthYear(currentDate);
      }
    }
    return formatMonthYear(currentMonth);
  };

  // Handler pour le clic sur un événement
  const handleEventClick = (info) => {
    const event = info.event;
    
    if (event.extendedProps && event.extendedProps.type === 'formation') {
      const formationId = event.extendedProps.formationId;
      navigate(`/formateur/formations/${formationId}`);
    }
  };

  // Mémoiser les événements pour éviter les re-rendus inutiles
  const memoizedEvents = useMemo(() => events, [events]);

  // Rafraîchir manuellement les formations
  const handleRefresh = () => {
    fetchFormations(true);
  };
  return (
    <div className="max-w-7xl mx-auto px-4 py-6" style={{ maxWidth: '83rem' }}>
      {/* Intégration des styles CSS directement dans le composant */}
      <style>{calendarStyles}</style>
      
      {/* En-tête */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-left">Mon Calendrier</h1>
        
        {/* Bouton qui ouvre le choix */}
        <Button 
          className="bg-black text-white hover:bg-orange-600 rounded-[4px]"
          onClick={() => setOpen(true)}
        >
          + Créer événement/Formation
        </Button>

        {/* Modal de sélection */}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Que souhaitez-vous créer ?</DialogTitle>
            </DialogHeader>
            <div className="flex justify-center gap-4">
              <Button className="bg-blue-500 hover:bg-blue-600 text-white" onClick={() => handleSelection("event")}>
                Événement
              </Button>
              <Button className="bg-green-500 hover:bg-green-600 text-white" onClick={() => handleSelection("formation")}>
                Formation
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="flex">
        {/* Sidebar des catégories */}
        <div className="w-48 h-48 border-r border-gray-200 p-4  rounded-[4px] shadow-md" style={{ backgroundColor: "#FF79000D" }}>
          <h3 className="font-medium font-bold text-gray-700 mb-4">Catégories</h3>
          <ul className="space-y-2">
            <li className="flex items-center">
              <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: "#FBCFE8" }}></div>
              <span className="text-sm">Personnel Task</span>
            </li>
            <li className="flex items-center">
              <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: "#A7F3D0" }}></div>
              <span className="text-sm">Meetings</span>
            </li>
            <li className="flex items-center">
              <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: "#FED7AA" }}></div>
              <span className="text-sm">Formations</span>
            </li>
            <li className="flex items-center">
              <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: "#BFDBFE" }}></div>
              <span className="text-sm">Calls</span>
            </li>
            <li className="flex items-center">
              <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: "#FECACA" }}></div>
              <span className="text-sm">Urgent</span>
            </li>
          </ul>
        </div>

        {/* Zone principale du calendrier */}
        <div className="flex-grow p-6 bg-white rounded-[4px]">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center">
              {/* Titre du calendrier à gauche */}
              <h2 className="text-lg font-bold calendar-title">{getTitle()}</h2>
              
              {/* Flèches de navigation à droite */}
              <div className="ml-4 flex items-center">
                <button onClick={() => navigateDate('prev')} className="p-2 hover:bg-white rounded-[4px] font-bold" style={{ color: "#6B7280" }}>&lt;</button>
                <button onClick={() => navigateDate('next')} className="p-2 hover:bg-white rounded-[4px] font-bold" style={{ color: "#6B7280" }}>&gt;</button>
              </div>
            </div>
           
            <div className="flex space-x-2 bg-white">
              <Button 
                variant="ghost" 
                className="text-[#333] flex items-center gap-1 font-bold py-1 px-4 text-xs rounded-[4px] border border-gray-300 p-4"
                style={{ height: '28px', backgroundColor: '#EEE' }}
              >
                <svg width="12" height="12" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M0 3C0 2.44772 0.447715 2 1 2H19C19.5523 2 20 2.44772 20 3V5C20 5.26522 19.8946 5.51957 19.7071 5.70711L13 12.4142V19C13 19.5523 12.5523 20 12 20H8C7.44772 20 7 19.5523 7 19V12.4142L0.292893 5.70711C0.105357 5.51957 0 5.26522 0 5V3Z" fill="#000"/>
                </svg>
                Filtres
              </Button>

              <div className="flex space-x-1 bg-white p-0 border border-gray-300 rounded-[4px]">
                <Button 
                  variant="secondary" 
                  className={`bg-white hover:bg-gray-100 ${currentView === 'timeGridDay' ? 'bg-orange-500 text-white' : 'text-[#333]'} rounded-[4px] py-1 px-4 text-xs`}
                  style={{ height: '28px' }}
                  onClick={() => changeView('timeGridDay')}
                >
                  Jour
                </Button>

                <Button 
                  variant="secondary" 
                  className={`bg-white hover:bg-gray-100 ${currentView === 'timeGridWeek' ? 'bg-orange-500 text-white' : 'text-[#333]'} rounded-[4px] py-1 px-4 text-xs`}
                  style={{ height: '28px' }}
                  onClick={() => changeView('timeGridWeek')}
                >
                  Semaine
                </Button>

                <Button 
                  variant="secondary" 
                  className={`bg-white hover:bg-gray-100 ${currentView === 'dayGridMonth' ? 'bg-orange-500 text-white' : 'text-[#333]'} rounded-[4px] py-1 px-4 text-xs`}
                  style={{ height: '28px' }}
                  onClick={() => changeView('dayGridMonth')}
                >
                  Mois
                </Button>

                <Button 
                  variant="secondary" 
                  className={`bg-white hover:bg-gray-100 ${currentView === 'multiMonthYear' ? 'bg-orange-500 text-white' : 'text-[#333]'} rounded-[4px] py-1 px-4 text-xs`}
                  style={{ height: '28px' }}
                  onClick={() => changeView('multiMonthYear')}
                >
                  Année
                </Button>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="h-64 flex items-center justify-center">
              <p>Chargement des événements...</p>
            </div>
          ) : (
            <FullCalendar
              ref={calendarRef}
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, multiMonthPlugin]}
              initialView={currentView}
              headerToolbar={false}
              events={events}
              initialDate={currentMonth}
              height="calc(80vh - 150px)"
              locale="fr"
              eventDisplay="block"
              eventTextColor="white"
              dayHeaderFormat={{ weekday: 'short' }}
              eventClick={handleEventClick}
              views={{
                timeGridDay: { dayHeaderFormat: { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' } },
                timeGridWeek: { dayHeaderFormat: { weekday: 'short', month: 'numeric', day: 'numeric' } },
                dayGridMonth: { dayHeaderFormat: { weekday: 'short' } },
                multiMonthYear: { multiMonthMaxColumns: 3, multiMonthTitleFormat: { month: 'long' } }
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default CalendrierManager;