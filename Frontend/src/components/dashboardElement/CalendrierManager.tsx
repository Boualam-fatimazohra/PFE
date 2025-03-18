import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import multiMonthPlugin from '@fullcalendar/multimonth';
import { Button } from '@/components/ui/button';
import { useNavigate } from "react-router-dom";
import { ChevronDown, Filter } from 'lucide-react'; // Ajout de l'icône Filter

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useFormations } from "@/contexts/FormationContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

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
    extendedProps: {
      category: 'meetings'
    }
  },
  {
    id: '2',
    title: 'Team Call',
    start: '2025-01-03',
    end: '2025-01-04',
    backgroundColor: '#BFDBFE',
    extendedProps: {
      category: 'calls'
    }
  },
  {
    id: '3',
    title: 'Tâche importante',
    start: '2025-01-05',
    end: '2025-01-06',
    backgroundColor: '#FECACA',
    extendedProps: {
      category: 'urgent'
    }
  },
  {
    id: '4',
    title: 'Rendez-vous personnel',
    start: '2025-01-10',
    end: '2025-01-11',
    backgroundColor: '#FBCFE8',
    extendedProps: {
      category: 'personal'
    }
  },
];
const categories = [
  { id: 'personal', name: 'Personnel Task', color: '#FBCFE8', checked: true },
  { id: 'meetings', name: 'Meetings', color: '#A7F3D0', checked: true },
  { id: 'formations', name: 'Formations', color: '#FED7AA', checked: true },
  { id: 'calls', name: 'Calls', color: '#BFDBFE', checked: true },
  { id: 'urgent', name: 'Urgent', color: '#FECACA', checked: true },
];

// Cache constants
const STORAGE_KEY = {
  FORMATIONS: 'cached_manager_formations',
  TIMESTAMP: 'cached_manager_formations_timestamp',
  HASH: 'cached_manager_formations_hash'
};
const CACHE_DURATION =  60 * 1000; 

const CalendrierManager  = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date(2025, 0, 1)); // January 2025
  const [currentView, setCurrentView] = useState('dayGridMonth'); // Default view is month
  const calendarRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [events, setEvents] = useState([...staticEvents]); // Initialiser avec événements statiques
  const [isLoading, setIsLoading] = useState(true);
  const [formationEvents, setFormationEvents] = useState([]);
  const [lastUpdated, setLastUpdated] = useState(null);
  
  // État pour les catégories filtrables
  const [categoryFilters, setCategoryFilters] = useState(categories);
  
  // Récupération des formations depuis le context
  const { 
    formations: contextFormations, 
    loading, 
    getAllFormationsManager 
  } = useFormations();

  // Fonction pour générer un hash simple des formations
  const generateFormationsHash = useCallback((formations) => {
    return formations
      .map(f => `${f._id}-${f.dateDebut}-${f.dateFin}-${f.nom}-${f.status}`)
      .sort()
      .join('|');
  }, []);

  // Fonction pour convertir les formations en événements
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
        
        // Vérifier si le cache est encore valide
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

  // Fonction pour mettre à jour le cache et les événements
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
    
    setEvents(allEvents);
  }, [contextFormations, categoryFilters]);

  // Fonction pour gérer le changement d'état des cases à cocher
  const handleCategoryChange = (categoryId) => {
    setCategoryFilters(prev => 
      prev.map(cat => 
        cat.id === categoryId 
          ? { ...cat, checked: !cat.checked } 
          : cat
      )
    );
  };

  const handleSelection = (type) => {
    if (type === "event") {
      navigate("/manager/CreatEvent");
    } else if (type === "formation") {
      navigate("/formateur/formationModal");
    }
  };

  const formatMonthYear = (date) => {
    const monthYear = new Intl.DateTimeFormat('fr-FR', {
      month: 'long',
      year: 'numeric'
    }).format(date);
    
    return monthYear.charAt(0).toUpperCase() + monthYear.slice(1).toLowerCase();
  };

  const navigateMonth = (direction) => {
    const newDate = new Date(currentMonth);
    newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1));
    setCurrentMonth(newDate);
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      calendarApi.gotoDate(newDate);
    }
  };

  const navigateDate = (direction) => {
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      if (direction === 'next') {
        calendarApi.next();
      } else {
        calendarApi.prev();
      }
      // Update current date state based on calendar's current date
      setCurrentMonth(calendarApi.getDate());
    }
  };

  const changeView = (viewName) => {
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      calendarApi.changeView(viewName);
      setCurrentView(viewName);
    }
  };

  // Synchronize title when view changes
  useEffect(() => {
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      setCurrentMonth(calendarApi.getDate());
    }
  }, [currentView]);

  // Get appropriate title based on current view
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
          }).format(new Date(endDate.getTime() - 86400000)); // Subtract one day
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
  
  // Handler pour cliquer sur un événement
  const handleEventClick = (info) => {
    const event = info.event;
    
    // Si c'est une formation, naviguer vers la page détaillée
    if (event.extendedProps && event.extendedProps.type === 'formation') {
      const formationId = event.id.replace('formation-', '');
      // Trouver la formation dans le context
      const formation = contextFormations.find(f => f._id === formationId);
      if (formation) {
        // Rediriger vers la page de détails de la formation
        navigate(`/formateur/formations/${formationId}`);
      }
    }
  };
  
  const navigate = useNavigate();

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Intégration des styles CSS directement dans le composant */}
      <style>{calendarStyles}</style>
      
      {/* En-tête */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-left">Mon Calendrier</h1>
        
        {/* Menu déroulant pour créer formations/événements */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="bg-orange-500 text-white hover:bg-orange-600 rounded-[4px] flex items-center gap-2">
              + Créer formation <ChevronDown size={16} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handleSelection("formation")}>
              Formation
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleSelection("event")}>
              Événement
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      <div className="flex">
        {/* Sidebar des catégories */}
        <div className="w-48 h-48 border-r border-gray-200 p-4 rounded-[4px]" style={{ backgroundColor: "#FF79000D" }}>
          <h3 className="font-medium font-bold text-gray-700 mb-4">Catégories</h3>
          <ul className="space-y-2">
            {categoryFilters.map((category) => (
              <li key={category.id} className="flex items-center">
                <div 
                  className="w-3 h-3 rounded-full mr-2" 
                  style={{ backgroundColor: category.color, opacity: category.checked ? 1 : 0.5 }}
                ></div>
                <span className="text-sm" style={{ opacity: category.checked ? 1 : 0.5 }}>
                  {category.name}
                </span>
              </li>
            ))}
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
                <button onClick={() => navigateDate('prev')} className="p-2 hover:bg-gray-100 rounded-[4px]">&lt;</button>
                <button onClick={() => navigateDate('next')} className="p-2 hover:bg-gray-100 rounded-[4px]">&gt;</button>
              </div>
            </div>
            <style>{`
          .fc-header-toolbar .fc-toolbar-chunk:first-child {
            gap: 8px !important;
          }
          
          .calendar-content {
            display: flex;
            width: 100%;
          }
          
          .mini-calendar-wrapper {
            width: 200px;
            padding-top: 250px;
            margin-left: 300px;
            flex-shrink: 0;
          }
          
          .main-calendar-wrapper {
            flex-grow: 1;
            max-width: 1200px;
            margin-left: 0px;
            margin-right: 0px;
            padding: 0 80px;
          }
        `}</style>

            <div className="flex space-x-2 bg-white">
              {/* Bouton de filtrage avec menu déroulant */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
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
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-2 py-1.5 text-sm font-semibold">Catégories</div>
                  <DropdownMenuSeparator />
                  {categoryFilters.map((category) => (
                    <DropdownMenuCheckboxItem
                      key={category.id}
                      checked={category.checked}
                      onCheckedChange={() => handleCategoryChange(category.id)}
                      className="flex items-center gap-2"
                    >
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: category.color }}
                      ></div>
                      {category.name}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

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