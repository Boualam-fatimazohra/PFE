import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useState } from "react";
import * as dayjs from "dayjs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface EventItem {
  title: string;
  start: string;
  end: string;
  type: "Formation" | "Événement";
  location: string;
  status: "En cours" | "Terminé" | "À venir";

}

const events: EventItem[] = [
  { title: "Conception Mobile", start: "2025-03-01", end: "2025-03-05", type: "Formation", location: "Salle A", status: "En cours" },
  { title: "Développement Web", start: "2025-04-10", end: "2025-04-15", type: "Formation", location: "Salle B", status: "À venir" },
  { title: "Atelier IA", start: "2025-03-12", end: "2025-03-12", type: "Événement", location: "Amphi 1", status: "Terminé" },
  { title: "Hackathon", start: "2025-04-22", end: "2025-04-23", type: "Événement", location: "Espace Innovation", status: "À venir" }
];

const CalendarView = () => {
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);

  const handleEventClick = (info: any) => {
    const clickedEvent = events.find((e) => e.title === info.event.title);
    setSelectedEvent(clickedEvent || null);
  };

  return (
    <div className="p-6 bg-gradient-to-r from-gray-100 to-gray-50 shadow-xl rounded-xl">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-extrabold text-gray-900">📆 Calendrier</h2>
        <Button className="bg-orange-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-orange-700 transition-all">
          + Ajouter un événement
        </Button>
      </div>

      <div className="bg-white p-4 shadow-md rounded-lg">
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          events={events.map((event) => ({
            title: event.title,
            start: event.start,
            end: event.end,
            color: event.type === "Formation" ? "#F97316" : "#2563EB"
          }))}
          eventClick={handleEventClick}
          height="auto"
        />
      </div>

      {selectedEvent && (
        <Card className="mt-6 p-4 bg-white shadow-lg rounded-lg border-l-4 border-orange-500 animate-fade-in">
          <CardContent>
            <h3 className="text-xl font-semibold text-gray-800">{selectedEvent.title}</h3>
            <p className="text-gray-600 mt-2"><strong>📍 Lieu :</strong> {selectedEvent.location}</p>
            <p className="text-gray-600"><strong>📅 Date :</strong> {dayjs(selectedEvent.start).format("DD/MM/YYYY")} - {dayjs(selectedEvent.end).format("DD/MM/YYYY")}</p>
            <p className="text-gray-600"><strong>🔖 Type :</strong> {selectedEvent.type}</p>
            <p className="text-gray-600"><strong>⏳ Statut :</strong> <span className={selectedEvent.status === "En cours" ? "text-green-600" : "text-red-600"}>{selectedEvent.status}</span></p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CalendarView;