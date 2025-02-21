import { useState, useEffect, useRef } from "react";
import { Clock, MapPin, Users, AlignLeft, Check, X, ChevronDown, Calendar } from "lucide-react";

// TimePicker Component
const TimePicker = ({ selectedTime, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const generateTimeOptions = () => {
    const times = [];
    const start = new Date();
    start.setHours(0, 0, 0); 
    const end = new Date();
    end.setHours(23, 45, 0); 

    while (start <= end) {
      times.push(new Date(start));
      start.setMinutes(start.getMinutes() + 15); 
    }
    return times;
  };

  const timeOptions = generateTimeOptions();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString([], {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        className="bg-gray-100 px-4 py-2 rounded-md flex items-center justify-between min-w-[120px]"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{formatTime(selectedTime)}</span>
        <ChevronDown className="w-4 h-4 ml-2" />
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-48 overflow-y-auto">
          {timeOptions.map((time, index) => (
            <button
              key={index}
              className="w-full px-4 py-2 text-left hover:bg-gray-100"
              onClick={() => {
                const newDate = new Date(selectedTime);
                newDate.setHours(time.getHours());
                newDate.setMinutes(time.getMinutes());
                onChange(newDate);
                setIsOpen(false);
              }}
            >
              {formatTime(time)} ({time.getMinutes()} min)
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// DatePicker Component
const DatePicker = ({ selectedDate, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date(selectedDate));
  const dropdownRef = useRef(null);

  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay();
  };

  const daysInMonth = getDaysInMonth(
    currentMonth.getFullYear(),
    currentMonth.getMonth()
  );
  const firstDayOfMonth = getFirstDayOfMonth(
    currentMonth.getFullYear(),
    currentMonth.getMonth()
  );

  const generateDays = () => {
    const days = [];
    const prevMonthDays = getDaysInMonth(
      currentMonth.getFullYear(),
      currentMonth.getMonth() - 1
    );
    const nextMonthDays = getDaysInMonth(
      currentMonth.getFullYear(),
      currentMonth.getMonth() + 1
    );

    // Previous month days
    for (let i = firstDayOfMonth - 1; i >= 0; i--) {
      days.push({
        day: prevMonthDays - i,
        isCurrentMonth: false,
      });
    }

    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        day: i,
        isCurrentMonth: true,
      });
    }

    // Next month days
    for (let i = 1; i <= 42 - days.length; i++) {
      days.push({
        day: i,
        isCurrentMonth: false,
      });
    }

    return days;
  };

  const days = generateDays();

  const handleMonthChange = (direction) => {
    const newDate = new Date(currentMonth);
    if (direction === "prev") {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentMonth(newDate);
  };

  const handleDayClick = (day) => {
    const newDate = new Date(currentMonth);
    newDate.setDate(day);
    onChange(newDate);
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const formatDate = (date) => {
    return date.toLocaleDateString('fr-FR', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        className="bg-gray-100 px-4 py-2 rounded-md flex items-center justify-between min-w-[180px]"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{formatDate(selectedDate)}</span>
        <ChevronDown className="w-4 h-4 ml-2" />
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-1 w-64 bg-white border border-gray-200 rounded-md shadow-lg p-4">
          <div className="flex justify-between items-center mb-4">
            <button
              className="p-2 hover:bg-gray-100 rounded"
              onClick={() => handleMonthChange("prev")}
            >
              <ChevronDown className="w-4 h-4 rotate-90" />
            </button>
            <span className="font-medium">
              {currentMonth.toLocaleDateString('fr-FR', {
                month: 'long',
                year: 'numeric',
              })}
            </span>
            <button
              className="p-2 hover:bg-gray-100 rounded"
              onClick={() => handleMonthChange("next")}
            >
              <ChevronDown className="w-4 h-4 -rotate-90" />
            </button>
          </div>
          <div className="grid grid-cols-7 gap-1">
            {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((day, index) => (
              <div key={index} className="text-center text-sm text-gray-500">
                {day}
              </div>
            ))}
            {days.map(({ day, isCurrentMonth }, index) => (
              <button
                key={index}
                className={`w-8 h-8 flex items-center justify-center text-sm rounded ${
                  isCurrentMonth
                    ? 'text-gray-900 hover:bg-gray-100'
                    : 'text-gray-400'
                } ${
                  day === selectedDate.getDate() &&
                  isCurrentMonth
                    ? 'bg-orange-100 text-orange-700'
                    : ''
                }`}
                onClick={() => handleDayClick(day)}
              >
                {day}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// EventDialog Component
const EventDialog = ({
  isOpen,
  setIsOpen,
  selectedEvent,
  setSelectedEvent,
  eventColor,
  setEventColor,
  handleSave,
  handleDelete,
}) => {
  const colors = [
    "#3788d8",
    "#28a745",
    "#dc3545",
    "#ffc107",
    "#6f42c1",
    "#fd7e14",
  ];

  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/50 ${
        isOpen ? "block" : "hidden"
      }`}
      onClick={() => setIsOpen(false)}
    >
      <div
        className="bg-white shadow-lg w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">
            {selectedEvent?.id ? "Modifier l'événement" : "Nouvel événement"}
          </h2>
          <button
            className="p-2 hover:bg-gray-100"
            onClick={() => setIsOpen(false)}
          >
            <X className="h-4 w-4 text-gray-500" />
          </button>
        </div>

        <div className="p-4 space-y-6">
          <input
            type="text"
            placeholder="Titre de l'événement"
            value={selectedEvent?.title || ""}
            onChange={(e) =>
              setSelectedEvent({ ...selectedEvent, title: e.target.value })
            }
            className="w-full p-2 text-lg font-medium border-0 focus:ring-0 focus:outline-none"
          />

          <div className="space-y-4">
          <div className="flex items-start gap-4">
  <Calendar className="h-5 w-5 text-gray-500 mt-1" />
  <div className="flex-1 flex gap-2">
    <DatePicker
      selectedDate={selectedEvent?.start || new Date()}
      onChange={(date) => {
        const newStart = new Date(date);
      
        newStart.setHours(selectedEvent?.start?.getHours() || 0);
        newStart.setMinutes(selectedEvent?.start?.getMinutes() || 0);
        
        setSelectedEvent(prev => ({
          ...prev,
          start: newStart,
          
          end: prev.end < newStart ? newStart : prev.end
        }));
      }}
    />
    <span className="text-gray-500">to</span>
    <DatePicker
      selectedDate={selectedEvent?.end || new Date()}
      onChange={(date) => {
        const newEnd = new Date(date);
       
        newEnd.setHours(selectedEvent?.end?.getHours() || 0);
        newEnd.setMinutes(selectedEvent?.end?.getMinutes() || 0);
        
        setSelectedEvent(prev => ({
          ...prev,
          end: newEnd,
          
          start: prev.start > newEnd ? newEnd : prev.start
        }));
      }}
    />
  </div>
</div>

<div className="flex items-start gap-4">
  <Clock className="h-5 w-5 text-gray-500 mt-1" />
  <div className="flex-1">
    <div className="flex items-center gap-2">
      <TimePicker
        selectedTime={selectedEvent?.start || new Date()}
        onChange={(time) => {
          const newStart = new Date(selectedEvent.start);
          newStart.setHours(time.getHours());
          newStart.setMinutes(time.getMinutes());
          
          setSelectedEvent(prev => ({
            ...prev,
            start: newStart,
            end: newStart > prev.end ? newStart : prev.end
          }));
        }}
      />
      <span className="text-gray-500">-</span>
      <TimePicker
        selectedTime={selectedEvent?.end || new Date()}
        onChange={(time) => {
          const newEnd = new Date(selectedEvent.end);
          newEnd.setHours(time.getHours());
          newEnd.setMinutes(time.getMinutes());
          
          setSelectedEvent(prev => ({
            ...prev,
            end: newEnd,
            start: prev.start > newEnd ? newEnd : prev.start
          }));
        }}
      />
    </div>
  </div>


            </div>

            <div className="flex items-start gap-4">
              <MapPin className="h-5 w-5 text-gray-500 mt-1" />
              <input
                type="text"
                placeholder="Ajouter un lieu"
                value={selectedEvent?.location || ""}
                onChange={(e) =>
                  setSelectedEvent({ ...selectedEvent, location: e.target.value })
                }
                className="w-full p-2 border-0 focus:ring-0 focus:outline-none placeholder-gray-500"
              />
            </div>

            <div className="flex items-start gap-4">
              <Users className="h-5 w-5 text-gray-500 mt-1" />
              <input
                type="text"
                placeholder="Ajouter des invités"
                value={selectedEvent?.guests || ""}
                onChange={(e) =>
                  setSelectedEvent({ ...selectedEvent, guests: e.target.value })
                }
                className="w-full p-2 border-0 focus:ring-0 focus:outline-none placeholder-gray-500"
              />
            </div>

            <div className="flex items-start gap-4">
              <AlignLeft className="h-5 w-5 text-gray-500 mt-1" />
              <input
                type="text"
                placeholder="Ajouter une description"
                value={selectedEvent?.description || ""}
                onChange={(e) =>
                  setSelectedEvent({ ...selectedEvent, description: e.target.value })
                }
                className="w-full p-2 border-0 focus:ring-0 focus:outline-none placeholder-gray-500"
              />
            </div>

            <div className="flex items-start gap-4">
              <div className="h-5 w-5 mt-1" />
              <div className="flex-1">
                <label className="text-sm text-gray-700 mb-2 block">
                  Couleur de l'événement
                </label>
                <div className="relative">
                  <div
                    className="w-8 h-8 rounded-full border-2 cursor-pointer"
                    style={{ backgroundColor: eventColor, borderColor: eventColor }}
                    onClick={() => setIsColorPickerOpen(!isColorPickerOpen)}
                  />

                  {isColorPickerOpen && (
                    <div className="absolute z-10 mt-2 p-2 bg-white border border-gray-200 rounded-lg shadow-lg">
                      <div className="flex gap-2">
                        {colors.map((color) => (
                          <div
                            key={color}
                            className="w-8 h-8 rounded-full border-2 cursor-pointer relative"
                            style={{
                              backgroundColor: color,
                              borderColor: eventColor === color ? color : "transparent",
                            }}
                            onClick={() => {
                              setEventColor(color);
                              setIsColorPickerOpen(false);
                            }}
                          >
                            {eventColor === color && (
                              <Check className="h-4 w-4 text-white absolute inset-0 m-auto" />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 p-4 border-t border-gray-200">
          {selectedEvent?.id && (
            <button
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700"
              onClick={() => handleDelete(selectedEvent.id)}
            >
              Supprimer
            </button>
          )}
          <button
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
            onClick={() => setIsOpen(false)}
          >
            Annuler
          </button>
          <button
            className="px-4 py-2 text-sm font-medium text-white bg-[#F16E00]"
            onClick={handleSave}
          >
            Sauvegarder
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventDialog;