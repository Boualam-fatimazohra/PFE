import { useState, useRef, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import multiMonthPlugin from '@fullcalendar/multimonth';
import { Button } from '@/components/ui/button';
import { useNavigate } from "react-router-dom";
import { maxHeaderSize } from 'http';

// Styles personnalisés directement dans le composant
const calendarStyles = `
  /* Style pour les en-têtes de jour (lun, mar, mer, etc.) */
  .fc .fc-col-header-cell {
    background-color: #f1f1f1; /* Fond gris clair pour les en-têtes de jour */
    padding: 10px 0;
  }
  /* Personnalisation de l'en-tête du calendrier */
.fc .fc-toolbar-title {
    color: #333; /* Couleur du titre (Mois, Année) */
    font-weight: bold;
}

/* Personnalisation de l'arrière-plan de l'en-tête */
.fc .fc-toolbar {
    background-color: #f4f4f4; /* Fond clair pour l'en-tête */
    padding: 10px 20px;
}

/* Personnalisation des flèches de navigation */
.fc .fc-button {
    background-color: #EEE; /* Fond des boutons de navigation */
    color: #333333; /* Couleur des flèches */
}

.fc .fc-button:hover {
    background-color: #ccc; /* Effet hover sur les boutons de navigation */
}

/* Personnalisation du bouton de vue (Jour, Semaine, Mois, Année) */
.fc .fc-button-active {
    background-color: #FF7900; /* Couleur du bouton actif */
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

const events = [
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
  },
  {
    id: '5',
    title: 'Team Call',
    start: '2025-01-10',
    end: '2025-01-11',
    backgroundColor: '#2196F3',
  },
  {
    id: '6',
    title: 'Workshop',
    start: '2025-01-12',
    end: '2025-01-13',
    backgroundColor: '#F16E00',
  },
  {
    id: '7',
    title: 'Design Review',
    start: '2025-01-18',
    end: '2025-01-19',
    backgroundColor: '#4CAF50',
  },
  {
    id: '8',
    title: 'Workshop',
    start: '2025-01-19',
    end: '2025-01-20',
    backgroundColor: '#F16E00',
  },
  {
    id: '9',
    title: 'Workshop',
    start: '2025-01-26',
    end: '2025-01-27',
    backgroundColor: '#F16E00',
  }
];

const CalendrierManager = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date(2025, 0, 1)); // January 2025
  const [currentView, setCurrentView] = useState('dayGridMonth'); // Default view is month
  const calendarRef = useRef(null);
  
  // Function to format month and year
  const formatMonthYear = (date) => {
    const monthYear = new Intl.DateTimeFormat('fr-FR', {
      month: 'long',
      year: 'numeric'
    }).format(date);
    
    // Capitalise uniquement la première lettre
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
  const navigate = useNavigate();

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 "style={{ maxWidth: '83rem' }}>
      {/* Intégration des styles CSS directement dans le composant */}
      <style>{calendarStyles}</style>
      
      {/* En-tête */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-left">Mon Calendrier</h1>
        <Button 
          className="bg-black text-white hover:bg-orange-600 rounded-[4px]"
          onClick={() => navigate("/CreatEvent")}  >
          + Créer un événement
        </Button>      
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
        <div className="flex-grow p-6 bg-white  rounded-[4px]">
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
      className={`bg-white  hover:bg-gray-100 ${currentView === 'timeGridDay' ? 'bg-orange-500 text-white' : 'text-[#333]'} rounded-[4px] py-1 px-4 text-xs`}
      style={{ height: '28px' }}
      onClick={() => changeView('timeGridDay')}
    >
      Jour
    </Button>

    <Button 
      variant="secondary" 
      className={`bg-white  hover:bg-gray-100 ${currentView === 'timeGridWeek' ? 'bg-orange-500 text-white' : 'text-[#333]'} rounded-[4px] py-1 px-4 text-xs`}
      style={{ height: '28px' }}
      onClick={() => changeView('timeGridWeek')}
    >
      Semaine
    </Button>

    <Button 
      variant="secondary" 
      className={`bg-white  hover:bg-gray-100 ${currentView === 'dayGridMonth' ? 'bg-orange-500 text-white' : 'text-[#333]'} rounded-[4px] py-1 px-4 text-xs`}
      style={{ height: '28px' }}
      onClick={() => changeView('dayGridMonth')}
    >
      Mois
    </Button>

    <Button 
      variant="secondary" 
      className={`bg-white  hover:bg-gray-100 ${currentView === 'multiMonthYear' ? 'bg-orange-500 text-white' : 'text-[#333]'} rounded-[4px] py-1 px-4 text-xs`}
      style={{ height: '28px' }}
      onClick={() => changeView('multiMonthYear')}
    >
      Année
    </Button>
  </div>
</div>

          </div>

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
            views={{
              timeGridDay: { dayHeaderFormat: { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' } },
              timeGridWeek: { dayHeaderFormat: { weekday: 'short', month: 'numeric', day: 'numeric' } },
              dayGridMonth: { dayHeaderFormat: { weekday: 'short' } },
              multiMonthYear: { multiMonthMaxColumns: 3, multiMonthTitleFormat: { month: 'long' } }
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default CalendrierManager;