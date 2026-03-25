import React from 'react';
import { Calendar as CalendarIcon, Clock, CheckCircle2, Circle, Settings, AlertCircle, CheckSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function TasksView({ 
  filteredTasks, 
  statusFilter, 
  setStatusFilter, 
  priorityFilter, 
  setPriorityFilter,
  onToggleStatus,
  onDeleteTask
}) {
  const getPriorityColor = (p) => {
    switch (p) {
      case 'High': return 'bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 border-red-100 dark:border-red-900/50';
      case 'Medium': return 'bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-900/50';
      case 'Low': return 'bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 border-blue-100 dark:border-blue-900/50';
      default: return 'bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-100 dark:border-gray-700';
    }
  };

  const getStatusIcon = (s) => {
    return (
      <AnimatePresence mode="wait">
        <motion.div
          key={s}
          initial={{ scale: 0.5, opacity: 0, rotate: -20 }}
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
          exit={{ scale: 0.5, opacity: 0, rotate: 20 }}
          transition={{ duration: 0.2, ease: "backOut" }}
        >
          {s === 'Completed' ? (
            <CheckCircle2 size={18} className="text-emerald-500" />
          ) : s === 'In Progress' ? (
            <Clock size={18} className="text-amber-500" />
          ) : (
            <Circle size={18} className="text-gray-300" />
          )}
        </motion.div>
      </AnimatePresence>
    );
  };

  return (
    <div className="max-w-6xl mx-auto">
      <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold mb-2 dark:text-white">Tasks</h2>
          <p className="text-gray-500 dark:text-gray-400">Manage and track your project milestones.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400 font-medium">Status:</span>
            <select 
              className="text-xs bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg px-3 py-2 focus:ring-1 focus:ring-orange-500 outline-none shadow-sm dark:text-gray-100"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All Status</option>
              <option value="Todo">Todo</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400 font-medium">Priority:</span>
            <select 
              className="text-xs bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg px-3 py-2 focus:ring-1 focus:ring-orange-500 outline-none shadow-sm dark:text-gray-100"
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
            >
              <option value="All">All Priority</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
        </div>
      </header>

      <section className="bg-white rounded-2xl border border-[#E5E7EB] dark:border-gray-800 shadow-sm overflow-hidden">
        <div className="divide-y divide-[#E5E7EB] dark:divide-gray-800">
          {filteredTasks.map((task) => (
            <motion.div 
              layout
              key={task.id} 
              initial={false}
              animate={{ 
                opacity: task.status === 'Completed' ? 0.6 : 1,
                x: task.status === 'Completed' ? 4 : 0,
                backgroundColor: task.status === 'Completed' ? 'rgba(16, 185, 129, 0.05)' : 'rgba(255, 255, 255, 0)'
              }}
              transition={{ 
                type: "spring", 
                stiffness: 300, 
                damping: 30,
                backgroundColor: { duration: 0.5 }
              }}
              className="p-6 hover:bg-white dark:hover:bg-gray-800 flex items-center justify-between group border-b border-[#E5E7EB] dark:border-gray-800 last:border-0"
            >
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => onToggleStatus(task.id)}
                  className="shrink-0 hover:scale-110 transition-transform"
                >
                  {getStatusIcon(task.status)}
                </button>
                <div>
                  <motion.p 
                    layout
                    className={`font-semibold transition-all duration-500 ${task.status === 'Completed' ? 'line-through text-gray-400' : 'text-gray-900'}`}
                  >
                    {task.title}
                  </motion.p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded border ${getPriorityColor(task.priority)}`}>
                      {task.priority}
                    </span>
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      <CalendarIcon size={12} />
                      {task.dueDate}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="p-2 text-gray-400 hover:text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-950/30 rounded-lg transition-all">
                  <Settings size={16} />
                </button>
                <button 
                  onClick={() => onDeleteTask(task.id)}
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-all"
                >
                  <AlertCircle size={16} />
                </button>
              </div>
            </motion.div>
          ))}
          {filteredTasks.length === 0 && (
            <div className="p-20 text-center">
              <div className="w-16 h-16 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckSquare className="text-gray-300 dark:text-gray-600" size={32} />
              </div>
              <p className="text-gray-500 dark:text-gray-400 font-medium">No tasks found matching your criteria.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
