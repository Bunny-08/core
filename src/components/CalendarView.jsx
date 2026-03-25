import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Clock } from 'lucide-react';

export default function CalendarView() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const month = currentDate.toLocaleString('default', { month: 'long' });
  const year = currentDate.getFullYear();

  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const mockEvents = {
    12: [{ title: 'GST Filing', color: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 border-orange-200 dark:border-orange-800/50' }],
    15: [{ title: 'Team Lunch', color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800/50' }],
    22: [{ title: 'Mumbai Branch Launch', color: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/50' }],
    28: [{ title: 'Client Review', color: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-800/50' }],
  };

  const calendarDays = [];
  // Add empty slots for days before the first day of the month
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarDays.push(null);
  }
  // Add actual days of the month
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push(i);
  }

  return (
    <div className="max-w-6xl mx-auto">
      <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div>
            <h2 className="text-3xl font-bold mb-2 dark:text-white">Calendar</h2>
            <p className="text-gray-500 dark:text-gray-400">Schedule and manage your upcoming events.</p>
          </div>
          <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
            <Clock size={16} className="text-orange-600" />
            <span className="text-sm font-bold font-mono dark:text-white">
              {now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={goToToday}
            className="px-4 py-2 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 font-bold text-sm rounded-xl border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all shadow-sm"
          >
            Today
          </button>
          <div className="flex items-center gap-2 bg-white dark:bg-gray-900 p-2 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
            <button 
              onClick={prevMonth}
              className="p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors dark:text-gray-400"
            >
              <ChevronLeft size={20} />
            </button>
            <span className="font-bold text-sm min-w-[140px] text-center dark:text-white">{month} {year}</span>
            <button 
              onClick={nextMonth}
              className="p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors dark:text-gray-400"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </header>

      <div className="bg-white rounded-2xl border border-[#E5E7EB] dark:border-gray-800 shadow-sm overflow-hidden">
        <div className="grid grid-cols-7 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50">
          {daysOfWeek.map(day => (
            <div key={day} className="p-4 text-center text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 auto-rows-[120px]">
          {calendarDays.map((day, i) => {
            const isToday = day === now.getDate() && 
                            currentDate.getMonth() === now.getMonth() && 
                            currentDate.getFullYear() === now.getFullYear();
            
            return (
              <div 
                key={i} 
                className={`p-3 border-r border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer relative group ${day === null ? 'bg-gray-50/20 dark:bg-gray-800/20' : ''}`}
              >
                {day && (
                  <>
                    <span className={`text-sm font-medium ${isToday ? 'w-7 h-7 flex items-center justify-center bg-orange-600 text-white rounded-full' : 'text-gray-600'}`}>
                      {day}
                    </span>
                    <div className="mt-2 space-y-1">
                      {mockEvents[day]?.map((event, idx) => (
                        <div 
                          key={idx} 
                          className={`p-1 px-2 text-[9px] font-bold rounded border truncate ${event.color}`}
                        >
                          {event.title}
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
