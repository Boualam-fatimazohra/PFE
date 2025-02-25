import { useState, useRef } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';
import MiniCalendar from './minicalendar';
import EventDialog from './EventDialog';
import * as dayjs from 'dayjs';
import 'dayjs/locale/fr';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';

interface EventItem {
  id: string;
  title: string;
  start: string;
  end: string;
  type: 'Formation' | 'Événement';
  location: string;
  status: 'En cours' | 'Terminé' | 'À venir';
}

const events: EventItem[] = [
  {
    id: '1',
    title: 'Conception Mobile',
    start: '2025-03-01',
    end: '2025-03-05',
    type: 'Formation',
    location: 'Salle A',
    status: 'En cours',
  },
  {
    id: '2',
    title: 'Développement Web',
    start: '2025-04-10',
    end: '2025-04-15',
    type: 'Formation',
    location: 'Salle B',
    status: 'À venir',
  },
  {
    id: '3',
    title: 'Atelier IA',
    start: '2025-03-12',
    end: '2025-03-12',
    type: 'Événement',
    location: 'Amphi 1',
    status: 'Terminé',
  },
  {
    id: '4',
    title: 'Hackathon',
    start: '2025-04-22',
    end: '2025-04-23',
    type: 'Événement',
    location: 'Espace Innovation',
    status: 'À venir',
  },
];

const CalendarView = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isEventDialogOpen, setIsEventDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [eventColor, setEventColor] = useState("#3788d8");
  const mainCalendarRef = useRef(null);

  const handleDateClick = (arg) => {
    mainCalendarRef.current.getApi().gotoDate(arg.date);
  };

  const handleDelete = (eventId) => {
    const calendarApi = mainCalendarRef.current.getApi();
    const event = calendarApi.getEventById(eventId);
    if (event) {
      event.remove();
    }
    setIsEventDialogOpen(false);
    setSelectedEvent(null);
  };

  const handleEventClick = (info) => {
    setSelectedEvent({
      id: info.event.id,
      title: info.event.title || "",
      start: info.event.start,
      end: info.event.end || info.event.start,
      guests: info.event.extendedProps.guests || "",
      location: info.event.extendedProps.location || "",
      description: info.event.extendedProps.description || "",
    });
    setEventColor(info.event.backgroundColor || "#3788d8");
    setIsEventDialogOpen(true);
  };

  const handleEventCreate = (info) => {
    const startDate = info.date;
    const endDate = new Date(startDate.getTime() + 60 * 60 * 1000); 
    setSelectedEvent({
      start: startDate,
      end: endDate,
      title: "",
      guests: "",
      location: "",
      description: "",
    });
    setIsEventDialogOpen(true);
  };

  const handleSelect = (info) => {
    setSelectedEvent({
      start: info.start,
      end: info.end,
      title: "",
      guests: "",
      location: "",
      description: "",
    });
    setIsEventDialogOpen(true);
  };

  const handleSave = () => {
    const calendarApi = mainCalendarRef.current.getApi();
    if (selectedEvent.id) {
      
      const event = calendarApi.getEventById(selectedEvent.id);
      event.setProp("title", selectedEvent.title);
      event.setStart(selectedEvent.start);
      event.setEnd(selectedEvent.end);
      event.setExtendedProp("guests", selectedEvent.guests);
      event.setExtendedProp("location", selectedEvent.location);
      event.setExtendedProp("description", selectedEvent.description);
      event.setProp("backgroundColor", eventColor);
    } else {
      // Add new event
      calendarApi.addEvent({
        id: String(Math.random()),
        title: selectedEvent.title,
        start: selectedEvent.start,
        end: selectedEvent.end,
        guests: selectedEvent.guests,
        location: selectedEvent.location,
        description: selectedEvent.description,
        backgroundColor: eventColor,
      });
    }
    setIsEventDialogOpen(false);
    setSelectedEvent(null);
  };

  const navigateMonth = (direction) => {
    const newDate = new Date(currentMonth);
    if (direction === "prev") {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentMonth(newDate);
  };

  return (
    <div className="flex min-h-screen bg-white">
     <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap');

        * {
          font-family: 'Inter', sans-serif !important;
        }

        .fc {
          font-family: 'Inter', sans-serif !important;
        }
        .fc-header-toolbar {
          padding: 1rem 0 !important;
        }
        .fc-toolbar-title {
          font-size: 1.5rem !important;
          font-weight: 400 !important;
          text-transform: capitalize;
        }
        .fc-col-header {
          background: white !important;
        }
        .fc-col-header-cell {
          padding: 8px 0 !important;
          vertical-align: top !important;
        }
        .fc-col-header-cell-cushion {
          display: flex !important;
          flex-direction: column !important;
          align-items: center !important;
          color: #70757a !important;
          text-decoration: none !important;
          padding: 4px !important;
        }
        .fc-day-today .fc-col-header-cell-cushion {
          background: #F16E00 !important;
          color: white !important;
          border-radius: 60% !important;
          width: 52px !important;
          height: 52px !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
        }
        .fc-timegrid-slot {
          height: 48px !important;
        }
        .fc-timegrid-slot-label {
          font-size: 0.75rem !important;
          color: #70757a !important;
        }
        .fc-theme-standard td, .fc-theme-standard th {
          border-color: #DFE0E1 !important;
        }
        .fc-scrollgrid {
          border: none !important;
        }
        .fc .fc-button {
          background: white !important;
          border: 1px solid #DFE0E1 !important;
          color: #70757a !important;
          border-radius: 20px !important;
          padding: 6px 16px !important;
          font-weight: 500 !important;
          text-transform: none !important;
          box-shadow: none !important;
        }

        .fc .fc-button:hover {
          background: #f8f9fa !important;
        }

        .fc .fc-prev-button, .fc .fc-next-button {
          width: 32px !important;
          height: 32px !important;
          padding: 0 !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
        }

        .fc .fc-today-button {
          padding: 6px 16px !important;
        }

        .fc .fc-button-active {
          background: #F16E00 !important;
          border-color: #F16E00 !important;
          color: white !important;
        }
      
        .mini-calendar {
          border: 1px solid #DFE0E1;
          border-radius: 8px;
          padding: 16px;
          background: white;
        }
        .fc-toolbar-chunk {
          gap: 12px !important;
        }
        
        .fc-button-group {
          gap: 6px !important;
        }

        .fc-button {
          margin: 0 4px !important;
        }

        .fc-header-toolbar .fc-toolbar-chunk:first-child {
          gap: 8px !important;
        }
      `}</style>
      <div className="flex w-full gap-6 p-4">
        {/* Mini Calendar */}
        <div className="w-60">
          <MiniCalendar
            currentMonth={currentMonth}
            onMonthChange={navigateMonth}
            onDateClick={handleDateClick}
          />
        </div>

        {/* Main Calendar */}
        <div className="flex-1">
          <FullCalendar
            ref={mainCalendarRef}
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay",
            }}
            buttonText={{
              today: "Aujourd'hui",
              month: "Mois",
              week: "Semaine",
              day: "Jour",
            }}
            initialView="timeGridWeek"
            editable={true}
            selectable={true}
            selectMirror={true}
            dayMaxEvents={true}
            weekends={true}
            slotMinTime="09:00:00"
            slotMaxTime="21:00:00"
            eventColor="#039BE5"
            eventBorderColor="transparent"
            height="calc(100vh - 2rem)"
            nowIndicator={true}
            allDaySlot={true}
            allDayText="All day"
            slotLabelFormat={{
              hour: "numeric",
              minute: "2-digit",
              omitZeroMinute: true,
              meridiem: "short",
            }}
            dayHeaderFormat={{
              weekday: "short",
              day: "numeric",
              omitCommas: true,
            }}
            dateClick={handleEventCreate}
            eventClick={handleEventClick}
            select={handleSelect}
          />
        </div>
      </div>

      {/* Event Dialog */}
      <EventDialog
        isOpen={isEventDialogOpen}
        setIsOpen={setIsEventDialogOpen}
        selectedEvent={selectedEvent}
        setSelectedEvent={setSelectedEvent}
        eventColor={eventColor}
        setEventColor={setEventColor}
        handleSave={handleSave}
        handleDelete={handleDelete}
      />

      {/* Footer */}
      <footer className="fixed bottom-0 w-full bg-black border-t border-gray-200 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-sm text-white">© Orange 2025</p>
            </div>
            <nav className="flex space-x-6">
              <a
                href="#"
                className="text-sm text-white hover:text-orange-500 transition-colors duration-200"
                aria-label="Accessibility statement"
              >
                Accessibility statement
              </a>
              <a
                href="#"
                className="text-sm text-white hover:text-orange-500 transition-colors duration-200"
                aria-label="Contact us"
              >
                Contact
              </a>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CalendarView;