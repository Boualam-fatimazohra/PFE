import { useState, useRef, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';
import multiMonthPlugin from '@fullcalendar/multimonth';
import { Button } from '@/components/ui/button';
import { useNavigate } from "react-router-dom";
import { useEdc } from "@/contexts/EdcContext"; // Utiliser useEdc au lieu de useFormations
import { ChevronDown, Filter } from 'lucide-react';

// Import des composants pour les dropdowns
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

import * as dayjs from 'dayjs';
import 'dayjs/locale/fr';

// Styles restent inchangés...
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

// Définition des catégories avec leurs couleurs correspondantes
const categories = [
  { id: 'personal', name: 'Personnel Task', color: '#FBCFE8', checked: true },
  { id: 'meetings', name: 'Meetings', color: '#A7F3D0', checked: true },
  { id: 'formations', name: 'Formations', color: '#FED7AA', checked: true },
  { id: 'calls', name: 'Calls', color: '#BFDBFE', checked: true },
  { id: 'urgent', name: 'Urgent', color: '#FECACA', checked: true },
];

// Événements statiques avec les catégories correspondantes
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

const CalendrierEcoleCode = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date(2025, 0, 1)); // January 2025
  const [currentView, setCurrentView] = useState('dayGridMonth'); // Default view is month
  const calendarRef = useRef(null);
  const [events, setEvents] = useState([]);
  const [categoryFilters, setCategoryFilters] = useState(categories);
  
  // Récupération des formations depuis le context
  const { edcFormations, loading, fetchEdcFormations } = useEdc();

  // Charger les formations au montage du composant
  useEffect(() => {
    fetchEdcFormations();
  }, [fetchEdcFormations]);

  // Convertir les formations en événements du calendrier et appliquer les filtres
  useEffect(() => {
    // Construction de la liste des événements (formations + statiques)
    let allEvents = [...staticEvents]; // Commencer avec les événements statiques
    
    // Vérifier si les formations sont disponibles
    if (edcFormations && edcFormations.length > 0) {
      // Filtrer pour n'afficher que les formations si la catégorie est activée
      const showFormations = categoryFilters.find(cat => cat.id === 'formations')?.checked;
      
      if (showFormations) {
        // Transformer les formations en format d'événement pour FullCalendar
        const formationEvents = edcFormations.map(formation => ({
          id: `formation-${formation._id}`,
          title: formation.nom || formation.nom || 'Formation sans titre',
          start: formation.dateDebut || formation.dateDebut, // Gérer les différentes structures possibles
          end: formation.dateFin || formation.dateFin,
          backgroundColor: '#FED7AA', // Couleur pour les formations
          extendedProps: {
            category: 'formations',
            type: 'formation',
            formationId: formation._id
          }
        }));
        
        allEvents = [...allEvents, ...formationEvents];
      }
    }
    
    // Filtrer les événements en fonction des catégories sélectionnées
    const filteredEvents = allEvents.filter(event => {
      const category = event.extendedProps?.category;
      if (!category) return true; // Si pas de catégorie, montrer quand même
      
      // Trouver la catégorie dans notre liste de filtres
      const categoryFilter = categoryFilters.find(cat => cat.id === category);
      return categoryFilter?.checked || false;
    });
    
    setEvents(filteredEvents);
  }, [edcFormations, categoryFilters]);

  const handleSelection = (type) => {
    if (type === "event") {
      navigate("/formateur/CreatEvent");
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
          { 
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
          }
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
      const formationId = event.extendedProps.formationId;
      if (formationId) {
        // Rediriger vers la page de détails de la formation
        navigate(`/formateur/formations/${formationId}`);
      }
    }
  };

  // Function to toggle category visibility
  const toggleCategory = (categoryId) => {
    setCategoryFilters(prevFilters => {
      return prevFilters.map(cat => {
        if (cat.id === categoryId) {
          return { ...cat, checked: !cat.checked };
        }
        return cat;
      });
    });
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
            <Button className="bg-orange-500 text-white hover:bg-orange-600 rounded-md flex items-center gap-2">
              + Créer <ChevronDown size={16} />
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
        {/* Zone principale du calendrier */}
        <div className="flex-grow p-6 bg-white rounded-md">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center">
              {/* Titre du calendrier à gauche */}
              <h2 className="text-lg font-bold calendar-title">{getTitle()}</h2>
              
              {/* Flèches de navigation à droite */}
              <div className="ml-4 flex items-center">
                <button onClick={() => navigateDate('prev')} className="p-2 hover:bg-gray-100 rounded-md">&lt;</button>
                <button onClick={() => navigateDate('next')} className="p-2 hover:bg-gray-100 rounded-md">&gt;</button>
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
                    className="text-gray-700 flex items-center gap-1 font-medium py-1 px-4 text-xs rounded-md border border-gray-300"
                    style={{ height: '28px', backgroundColor: '#EEE' }}
                  >
                    <Filter size={14} />
                    Filtres
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {categoryFilters.map((category) => (
                    <DropdownMenuCheckboxItem
                      key={category.id}
                      checked={category.checked}
                      onCheckedChange={() => toggleCategory(category.id)}
                    >
                      <div className="flex items-center">
                        <div
                          className="w-3 h-3 rounded-full mr-2"
                          style={{ backgroundColor: category.color }}
                        ></div>
                        {category.name}
                      </div>
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <div className="flex space-x-1 bg-white p-0 border border-gray-300 rounded-md">
                <Button 
                  variant="secondary" 
                  className={`bg-white hover:bg-gray-100 ${currentView === 'timeGridDay' ? 'bg-orange-500 text-white' : 'text-gray-700'} rounded-md py-1 px-4 text-xs`}
                  style={{ height: '28px' }}
                  onClick={() => changeView('timeGridDay')}
                >
                  Jour
                </Button>

                <Button 
                  variant="secondary" 
                  className={`bg-white hover:bg-gray-100 ${currentView === 'timeGridWeek' ? 'bg-orange-500 text-white' : 'text-gray-700'} rounded-md py-1 px-4 text-xs`}
                  style={{ height: '28px' }}
                  onClick={() => changeView('timeGridWeek')}
                >
                  Semaine
                </Button>

                <Button 
                  variant="secondary" 
                  className={`bg-white hover:bg-gray-100 ${currentView === 'dayGridMonth' ? 'bg-orange-500 text-white' : 'text-gray-700'} rounded-md py-1 px-4 text-xs`}
                  style={{ height: '28px' }}
                  onClick={() => changeView('dayGridMonth')}
                >
                  Mois
                </Button>

                <Button 
                  variant="secondary" 
                  className={`bg-white hover:bg-gray-100 ${currentView === 'multiMonthYear' ? 'bg-orange-500 text-white' : 'text-gray-700'} rounded-md py-1 px-4 text-xs`}
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
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, multiMonthPlugin, listPlugin]}
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

export default CalendrierEcoleCode;