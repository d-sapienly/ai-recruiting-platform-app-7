import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { Button } from '../ui/button';

interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  type: 'interview' | 'meeting' | 'task';
  participants?: string[];
}

interface CalendarTabProps {
  events: CalendarEvent[];
}

const CalendarTab: React.FC<CalendarTabProps> = ({ events = [] }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentView, setCurrentView] = useState<'month' | 'week' | 'day'>('month');

  // Helper to get days in month
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  // Helper to get day of week (0 = Sunday, 6 = Saturday)
  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  // Generate calendar days
  const generateCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const daysInMonth = getDaysInMonth(year, month);
    const firstDayOfMonth = getFirstDayOfMonth(year, month);
    
    const days = [];
    
    // Add empty cells for days before the first day of month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push({ day: null, isCurrentMonth: false });
    }
    
    // Add days of current month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dateString = date.toISOString().split('T')[0];
      
      // Find events for this day
      const dayEvents = events.filter(event => event.date === dateString);
      
      days.push({
        day,
        isCurrentMonth: true,
        isToday: new Date().toDateString() === date.toDateString(),
        events: dayEvents,
        date: dateString
      });
    }
    
    // Add empty cells to complete the grid (if needed)
    const totalCells = Math.ceil((firstDayOfMonth + daysInMonth) / 7) * 7;
    for (let i = days.length; i < totalCells; i++) {
      days.push({ day: null, isCurrentMonth: false });
    }
    
    return days;
  };

  const calendarDays = generateCalendarDays();
  
  // Navigation functions
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };
  
  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };
  
  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Format event time
  const formatEventTime = (startTime: string, endTime: string) => {
    return `${startTime} - ${endTime}`;
  };

  // Get event color based on type
  const getEventColor = (type: string) => {
    switch (type) {
      case 'interview':
        return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'meeting':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'task':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="p-4 flex items-center justify-between border-b border-gray-200">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
          </h2>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex space-x-1">
            <Button variant="outline" size="sm" onClick={() => setCurrentView('month')}>
              Month
            </Button>
            <Button variant="outline" size="sm" onClick={() => setCurrentView('week')}>
              Week
            </Button>
            <Button variant="outline" size="sm" onClick={() => setCurrentView('day')}>
              Day
            </Button>
          </div>
          <div className="flex space-x-1">
            <Button variant="outline" size="sm" onClick={goToPreviousMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={goToToday}>
              Today
            </Button>
            <Button variant="outline" size="sm" onClick={goToNextMonth}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <Button size="sm" className="flex items-center">
            <Plus className="h-4 w-4 mr-1" />
            Add Event
          </Button>
        </div>
      </div>
      
      {currentView === 'month' && (
        <div className="p-4">
          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-px bg-gray-200">
            {/* Day headers */}
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className="bg-gray-50 py-2 text-center text-sm font-medium text-gray-500">
                {day}
              </div>
            ))}
            
            {/* Calendar days */}
            {calendarDays.map((day, index) => (
              <div 
                key={index} 
                className={`min-h-[100px] p-2 bg-white ${
                  !day.isCurrentMonth ? 'text-gray-400' : 
                  day.isToday ? 'bg-indigo-50' : ''
                }`}
              >
                {day.day !== null && (
                  <>
                    <div className={`text-right ${
                      day.isToday ? 'font-bold text-indigo-600' : ''
                    }`}>
                      {day.day}
                    </div>
                    <div className="mt-1 space-y-1 max-h-[80px] overflow-y-auto">
                      {day.events?.map((event) => (
                        <div 
                          key={event.id}
                          className={`px-2 py-1 text-xs rounded border ${getEventColor(event.type)}`}
                        >
                          <div className="font-medium truncate">{event.title}</div>
                          <div>{formatEventTime(event.startTime, event.endTime)}</div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      
      {currentView === 'week' && (
        <div className="p-4 text-center text-gray-500">
          Week view is under development
        </div>
      )}
      
      {currentView === 'day' && (
        <div className="p-4 text-center text-gray-500">
          Day view is under development
        </div>
      )}
      
      {/* Upcoming events sidebar */}
      <div className="border-t border-gray-200 p-4">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Upcoming Events</h3>
        <div className="space-y-3">
          {events.length > 0 ? (
            events
              .filter(event => new Date(event.date) >= new Date())
              .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
              .slice(0, 5)
              .map(event => (
                <div key={event.id} className="flex items-start space-x-3">
                  <div className={`flex-shrink-0 w-2 h-full rounded-full ${
                    event.type === 'interview' ? 'bg-indigo-500' :
                    event.type === 'meeting' ? 'bg-green-500' :
                    'bg-yellow-500'
                  }`}></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{event.title}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(event.date).toLocaleDateString()} • {formatEventTime(event.startTime, event.endTime)}
                    </p>
                  </div>
                </div>
              ))
          ) : (
            <p className="text-sm text-gray-500">No upcoming events</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CalendarTab;
