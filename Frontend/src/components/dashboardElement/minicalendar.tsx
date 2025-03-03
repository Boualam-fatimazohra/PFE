import { useRef, useEffect } from 'react';

const MiniCalendar = ({ currentMonth, onMonthChange, onDateClick, events }) => {
  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay();
  };

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const today = new Date();
  const selectedDate = new Date();

  const daysInMonth = getDaysInMonth(year, month);
  const firstDayOfMonth = getFirstDayOfMonth(year, month);

  const getPreviousMonthDays = () => {
    const prevMonth = month === 0 ? 11 : month - 1;
    const prevYear = month === 0 ? year - 1 : year;
    const daysInPrevMonth = getDaysInMonth(prevYear, prevMonth);
    return Array.from({ length: firstDayOfMonth }, (_, i) => daysInPrevMonth - firstDayOfMonth + i + 1);
  };

  const getCurrentMonthDays = () => {
    return Array.from({ length: daysInMonth }, (_, i) => i + 1);
  };

  const getNextMonthDays = () => {
    const remainingDays = 42 - (firstDayOfMonth + daysInMonth);
    return Array.from({ length: remainingDays }, (_, i) => i + 1);
  };

  const isToday = (day) => {
    return (
      today.getDate() === day &&
      today.getMonth() === month &&
      today.getFullYear() === year
    );
  };

  const isSelected = (day) => {
    return (
      selectedDate.getDate() === day &&
      selectedDate.getMonth() === month &&
      selectedDate.getFullYear() === year
    );
  };

  
  const getEventForDay = (day, isCurrentMonth) => {
    if (!events || !isCurrentMonth) return null;
    
    const date = new Date(year, month, day);
    const dateStr = date.toISOString().split('T')[0];
    const dayEvents = events.filter(event => {
      const eventStart = new Date(event.start);
      const eventEnd = new Date(event.end || event.start);
      const start = new Date(eventStart.getFullYear(), eventStart.getMonth(), eventStart.getDate());
      const end = new Date(eventEnd.getFullYear(), eventEnd.getMonth(), eventEnd.getDate());
      return date >= start && date <= end;
    });
    
    if (dayEvents.length === 0) return null;
    
    // Retourne le premier événement (pour la couleur)
    // On pourrait améliorer ça pour gérer plusieurs événements par jour
    return dayEvents[0];
  };

  const handleDateClick = (day, isCurrentMonth) => {
    if (!isCurrentMonth) return;
    const clickedDate = new Date(year, month, day);
    onDateClick({ date: clickedDate });
  };

  const renderDay = (day, isCurrentMonth, index) => {
    const dayIsToday = isCurrentMonth && isToday(day);
    const dayIsSelected = isCurrentMonth && isSelected(day);
    const eventForDay = isCurrentMonth ? getEventForDay(day, isCurrentMonth) : null;
    let bgColor = '';
    let textColor = 'text-gray-900';
    
    if (dayIsToday) {
      bgColor = 'bg-gray-500';
      textColor = 'text-white';
    } else if (eventForDay) {
      if (eventForDay.title?.toLowerCase().includes('spring') || 
          eventForDay.type === 'Formation') {
        bgColor = 'bg-red-500';
        textColor = 'text-white';
      } else if (eventForDay.title?.toLowerCase().includes('java') || 
                eventForDay.type === 'Événement') {
        bgColor = 'bg-blue-500';
        textColor = 'text-white';
      } else {
        bgColor = 'bg-orange-500';
        textColor = 'text-white';
      }
    } else if (dayIsSelected) {
      bgColor = 'bg-orange-100';
    }
    
    if (!isCurrentMonth) {
      textColor = 'text-gray-400';
    }
    
    return (
      <div 
        key={index} 
        onClick={() => handleDateClick(day, isCurrentMonth)}
        className={`
            w-8 h-8 flex items-center justify-center text-sm cursor-pointer
            ${textColor}
            ${bgColor}
            ${bgColor ? 'rounded-full' : ''} 
            hover:bg-gray-100 rounded-full transition-colors duration-200
          `}
      >
        {day}
      </div>
    );
  };
  
  return (
    <div className="w-full sm:w-60 p-4 border border-black shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-medium text-gray-900 truncate">
          {currentMonth.toLocaleDateString('fr-FR', { 
            month: 'long', 
            year: 'numeric' 
          })}
        </h2>
        <div className="flex gap-1">
          <button
            className="p-2 rounded hover:bg-gray-100 transition-colors duration-200"
            onClick={() => onMonthChange('prev')}
          >
            <svg className="w-4 h-4 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            className="p-2 rounded hover:bg-gray-100 transition-colors duration-200"
            onClick={() => onMonthChange('next')}
          >
            <svg className="w-4 h-4 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-7 gap-1">
        {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((day, index) => (
          <div key={index} className="w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center text-xs text-gray-500">
            {day}
          </div>
        ))}
        
        {getPreviousMonthDays().map((day, index) => renderDay(day, false, 'prev' + index))}
        {getCurrentMonthDays().map((day, index) => renderDay(day, true, 'current' + index))}
        {getNextMonthDays().map((day, index) => renderDay(day, false, 'next' + index))}
      </div>
    </div>
  );
};

export default MiniCalendar;