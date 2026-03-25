import React, { useState } from 'react';
import { Briefcase, MoreVertical, Calendar, CheckCircle2, Clock, AlertCircle, Bell, Search } from 'lucide-react';
import { motion } from 'motion/react';

export default function ProjectsView({ projects, onNewProject, onUpdateProject }) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProjects = projects.filter(project => 
    project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.client.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusStyles = (status) => {
    switch (status) {
      case 'Active': 
        return {
          classes: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-blue-100 dark:border-blue-800/50',
          border: 'border-l-4 border-l-blue-500',
          icon: <Clock size={12} />
        };
      case 'Completed': 
        return {
          classes: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-800/50',
          border: 'border-l-4 border-l-emerald-500',
          icon: <CheckCircle2 size={12} />
        };
      case 'On Hold': 
        return {
          classes: 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-800/50',
          border: 'border-l-4 border-l-amber-500',
          icon: <AlertCircle size={12} />
        };
      default: 
        return {
          classes: 'bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-100 dark:border-gray-700',
          border: 'border-l-4 border-l-gray-300',
          icon: null
        };
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold mb-2 dark:text-white">Projects</h2>
          <p className="text-gray-500 dark:text-gray-400">
            Overview of all active and completed initiatives.
          </p>
        </div>

        <button 
          onClick={onNewProject}
          className="px-4 py-2 bg-orange-600 text-white font-bold rounded-xl hover:bg-orange-700 transition-all shadow-sm flex items-center gap-2"
        >
          <Briefcase size={18} />
          New Project
        </button>
      </header>

      <div className="mb-6 relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <input 
          type="text" 
          placeholder="Search projects by name or client..." 
          className="w-full pl-12 pr-4 py-3 bg-white dark:bg-gray-900 border border-[#E5E7EB] dark:border-gray-800 rounded-2xl text-sm focus:ring-2 focus:ring-orange-500 transition-all outline-none dark:text-white shadow-sm"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredProjects.map((project) => {
          const status = getStatusStyles(project.status);

          return (
            <motion.div 
              key={project.id} 
              layout
              animate={
                project.status === 'Completed'
                  ? {
                      scale: [1, 1.02, 1],
                      boxShadow: [
                        "0 1px 2px 0 rgb(0 0 0 / 0.05)",
                        "0 0 20px 0 rgba(16, 185, 129, 0.2)",
                        "0 1px 2px 0 rgb(0 0 0 / 0.05)"
                      ]
                    }
                  : {}
              }
              transition={{ duration: 0.6 }}
              className={`bg-white p-6 rounded-2xl border border-[#E5E7EB] dark:border-gray-800 shadow-sm hover:shadow-md transition-all group relative overflow-hidden ${status.border}`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-orange-50 dark:bg-orange-950/30 rounded-xl flex items-center justify-center text-orange-600">
                    <Briefcase size={24} />
                  </div>

                  <div>
                    <h3 className="font-bold text-lg text-gray-900 group-hover:text-orange-600 transition-colors">
                      {project.name}
                    </h3>
                    <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">
                      {project.client}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className={`flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border ${status.classes}`}>
                    {status.icon}
                    {project.status}
                  </div>

                  <button className="p-2 text-gray-400 hover:bg-white dark:hover:bg-gray-800 rounded-lg">
                    <MoreVertical size={18} />
                  </button>
                </div>
              </div>

              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-gray-500 dark:text-gray-400">Progress</span>
                  <span className="text-xs font-bold text-orange-600">
                    {project.progress}%
                  </span>
                </div>

                <div className="w-full h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-orange-500 transition-all duration-1000" 
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-50 dark:border-gray-800">
                <div className="flex items-center gap-4">
                  <div className="flex -space-x-2">
                    {project.team.map((member, i) => (
                      <div 
                        key={i} 
                        className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 border-2 border-white dark:border-gray-900 flex items-center justify-center text-[10px] font-bold text-gray-600 dark:text-gray-400"
                      >
                        {member}
                      </div>
                    ))}

                    <div className="w-8 h-8 rounded-full bg-orange-50 dark:bg-orange-950/30 border-2 border-white dark:border-gray-900 flex items-center justify-center text-[10px] font-bold text-orange-600">
                      +2
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500">
                    <Calendar size={14} />
                    {project.dueDate}
                  </div>

                  <div className="flex items-center gap-2 ml-4">
                    <Bell size={14} className="text-gray-400" />

                    <select 
                      value={project.reminderDaysBefore || 0}
                      onChange={(e) =>
                        onUpdateProject(project.id, {
                          reminderDaysBefore: parseInt(e.target.value)
                        })
                      }
                      className="text-[10px] bg-transparent border-none focus:ring-0 text-gray-500 dark:text-gray-400 cursor-pointer hover:text-orange-600 transition-colors"
                    >
                      <option value={0}>No Reminder</option>
                      <option value={1}>1 day before</option>
                      <option value={3}>3 days before</option>
                      <option value={7}>1 week before</option>
                    </select>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
