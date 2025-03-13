import { useState, useRef, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';
import multiMonthPlugin from '@fullcalendar/multimonth';
import { Button } from '@/components/ui/button';
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useFormations } from "@/contexts/FormationContext"; // Importez le context pour les formations

import * as dayjs from 'dayjs';
import 'dayjs/locale/fr';
const calendarStyles = `
  /* Style pour les en-têtes de jour (lun, mar, mer, etc.) */
  .fc .fc-col-header-cell {
    background-color: #f1f1f1; /* Fond gris clair pour les en-têtes de jour */
    padding: 10px 0;
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

// Événements statiques (à conserver pour l'exemple ou pour les tests)
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
  // ...autres événements statiques
];

const CalendarView = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date(2025, 0, 1)); // January 2025
  const [currentView, setCurrentView] = useState('dayGridMonth'); // Default view is month
  const calendarRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [events, setEvents] = useState([]);
  
  // Récupération des formations depuis le context
  const { formations: contextFormations, loading } = useFormations();

  // Convertir les formations en événements du calendrier
  useEffect(() => {
    if (contextFormations && contextFormations.length > 0) {
      const formationEvents = contextFormations.map(formation => {
        // Déterminer la fin de l'événement (si dateFin existe, sinon dateDebut + 1 jour)
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
            status: formation.status
          }
        };
      });
      
      setEvents([...staticEvents, ...formationEvents]);
    } else {
      setEvents(staticEvents); 
    }
  }, [contextFormations]);

  const handleSelection = (type: "event" | "formation") => {
    setOpen(false);
    if (type === "event") {
      navigate("/CreatEvent");
    } else if (type === "formation") {
      navigate("/formateur/formationModal");
    }
  };

  const formatMonthYear = (date) => {
    return new Intl.DateTimeFormat('fr-FR', {
      month: 'long',
      year: 'numeric'
    }).format(date);
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
        // Vous pouvez adapter cette partie selon votre navigation
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
        <div className="flex-grow p-6 bg-white shadow-md rounded-[4px]">
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
            margin-left: 300px;  /*50px */
            flex-shrink: 0;
          }
          
          .main-calendar-wrapper {
            flex-grow: 1;
            max-width: 1200px; /* Ajuste la largeur max selon ton besoin */
            margin-left: 0px; /*70px */
            margin-right: 0px; /* Centrage horizontal */
            padding: 0 80px; /* 0 10 Ajoute du padding si besoin */
          }
        `}</style>

            <div className="flex space-x-2">
              <Button 
                variant="secondary" 
                className={currentView === 'timeGridDay' ? 'bg-orange-500 text-white' : ''} 
                size="sm" 
                onClick={() => changeView('timeGridDay')}
              >
                Jour
              </Button>
              <Button 
                variant="secondary" 
                className={currentView === 'timeGridWeek' ? 'bg-orange-500 text-white' : ''} 
                size="sm" 
                onClick={() => changeView('timeGridWeek')}
              >
                Semaine
              </Button>
              <Button 
                variant="secondary" 
                className={currentView === 'dayGridMonth' ? 'bg-orange-500 text-white' : ''} 
                size="sm" 
                onClick={() => changeView('dayGridMonth')}
              >
                Mois
              </Button>
              <Button 
                variant="secondary" 
                className={currentView === 'multiMonthYear' ? 'bg-orange-500 text-white' : ''} 
                size="sm" 
                onClick={() => changeView('multiMonthYear')}
              >
                Année
              </Button>
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

export default CalendarView;