import React from 'react';
import { Clock, CheckCircle2, Circle } from 'lucide-react';

export default function DashboardView({ stats, festivals, filteredTasks, onViewAllTasks, onToggleStatus }) {
  const today = new Date().toLocaleDateString('en-IN', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  const getStatusIcon = (s) => {
    switch (s) {
      case 'Completed':
        return <CheckCircle2 size={18} className="text-emerald-500" />;
      case 'In Progress':
        return <Clock size={18} className="text-amber-500" />;
      default:
        return <Circle size={18} className="text-gray-300" />;
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <header className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold mb-2 dark:text-white">Hello</h2>
          <p className="text-gray-500 dark:text-gray-400">
            You have {stats.inProgress} tasks in progress today.
          </p>
        </div>

        <div className="text-right">
          <p className="text-xs font-bold text-orange-600 uppercase tracking-widest">
            {today}
          </p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Tasks Section */}
        <div className="lg:col-span-2">
          <section className="bg-white rounded-2xl border border-[#E5E7EB] dark:border-gray-800 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-[#E5E7EB] dark:border-gray-800 flex items-center justify-between">
              <h3 className="font-bold text-lg text-gray-900">
                Upcoming Tasks
              </h3>

              <button 
                onClick={onViewAllTasks}
                className="text-sm text-orange-600 font-medium hover:underline"
              >
                View all
              </button>
            </div>

            <div className="divide-y divide-[#E5E7EB] dark:divide-gray-800">
              {[...filteredTasks]
                .filter(t => t.status !== 'Completed')
                .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
                .slice(0, 5)
                .map((task) => (
                  <div 
                    key={task.id} 
                    className="p-4 hover:bg-white dark:hover:bg-gray-800 flex items-center justify-between transition-colors group"
                  >
                    <div className="flex items-center gap-4">
                      <button 
                        onClick={() => onToggleStatus(task.id)}
                        className="shrink-0 hover:scale-110 transition-transform"
                      >
                        {getStatusIcon(task.status)}
                      </button>

                      <div>
                        <p className={`font-medium ${
                          task.status === 'Completed' 
                            ? 'line-through text-gray-400' 
                            : 'text-gray-900'
                        }`}>
                          {task.title}
                        </p>

                        <p className="text-xs text-gray-400">
                          Due: {task.dueDate} • {task.priority}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </section>
        </div>

        {/* Festivals Sidebar */}
        <div className="lg:col-span-1">
          <section className="bg-white rounded-2xl border border-[#E5E7EB] dark:border-gray-800 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-[#E5E7EB] dark:border-gray-800">
              <h3 className="font-bold text-lg text-gray-900">
                Upcoming Festivals
              </h3>
            </div>

            <div className="p-6 space-y-6">
              {festivals.map((fest, idx) => (
                <div key={idx} className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-orange-50 dark:bg-orange-950/30 rounded-xl flex flex-col items-center justify-center text-orange-600 shrink-0">
                    <span className="text-[10px] font-bold uppercase">
                      {fest.date.split(' ')[0].substring(0, 3)}
                    </span>
                    <span className="text-lg font-bold leading-none">
                      {fest.date.split(' ')[1].replace(',', '')}
                    </span>
                  </div>

                  <div>
                    <p className="font-semibold text-sm text-gray-900">
                      {fest.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {fest.type} Holiday
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
