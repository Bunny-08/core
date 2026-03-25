import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  CheckSquare, 
  Calendar, 
  Settings, 
  Plus, 
  Search, 
  Bell, 
  Briefcase, 
  Sun,
  Moon,
  X,
  AlertCircle
} from 'lucide-react';
import DashboardView from './components/DashboardView';
import TasksView from './components/TasksView';
import CalendarView from './components/CalendarView';
import SettingsView from './components/SettingsView';
import ProjectsView from './components/ProjectsView';

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [festivals, setFestivals] = useState([]);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState('Medium');
  const [newTaskDueDate, setNewTaskDueDate] = useState(new Date().toISOString().split('T')[0]);
  const [projects, setProjects] = useState([]);
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'New Task Assigned', message: 'Rajesh assigned you "Mumbai Branch Launch".', time: '2 mins ago', type: 'info' },
    { id: 2, title: 'Project Milestone Reached', message: 'GST Compliance Module is 100% complete.', time: '1 hour ago', type: 'info' }
  ]);
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectClient, setNewProjectClient] = useState('');
  const [user, setUser] = useState({
    name: 'Badrujama',
    email: 'badrujama@example.in',
    theme: 'light'
  });

  useEffect(() => {
    // Apply theme to document root and body
    console.log('Theme changed to:', user.theme);
    const root = document.documentElement;
    const body = document.body;
    
    if (user.theme === 'dark') {
      root.classList.add('dark');
      root.setAttribute('data-theme', 'dark');
      body.classList.add('dark');
      
      // Direct style injection for immediate feedback
      const styleId = 'dark-mode-override';
      if (!document.getElementById(styleId)) {
        const style = document.createElement('style');
        style.id = styleId;
        style.innerHTML = `
          .dark, .dark * {
            background-color: #030712 !important;
            color: #f3f4f6 !important;
            border-color: #1f2937 !important;
          }
          .dark .bg-white, .dark .bg-gray-50 {
            background-color: #111827 !important;
          }
          .dark .text-gray-900, .dark .text-gray-800 {
            color: #f3f4f6 !important;
          }
        `;
        document.head.appendChild(style);
      }
    } else {
      root.classList.remove('dark');
      root.setAttribute('data-theme', 'light');
      body.classList.remove('dark');
      const style = document.getElementById('dark-mode-override');
      if (style) style.remove();
    }
  }, [user.theme]);

  useEffect(() => {
    fetch('/api/tasks')
      .then(res => res.json())
      .then(data => {
        const enrichedData = data.map((t) => ({
          ...t,
          dueDate: new Date(Date.now() + Math.random() * 1000000000).toLocaleDateString()
        }));
        setTasks(enrichedData);
      })
      .catch(err => console.error("Failed to fetch tasks:", err));

    fetch('/api/festivals')
      .then(res => res.json())
      .then(data => setFestivals(data))
      .catch(err => console.error("Failed to fetch festivals:", err));

    fetch('/api/projects')
      .then(res => res.json())
      .then(data => setProjects(data))
      .catch(err => console.error("Failed to fetch projects:", err));
  }, []);

  const handleCreateProject = async () => {
    if (!newProjectName || !newProjectClient) return;

    const newProjectData = {
      name: newProjectName,
      client: newProjectClient,
      status: 'Active',
      dueDate: 'TBD'
    };

    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProjectData)
      });
      if (res.ok) {
        const createdProject = await res.json();
        setProjects([createdProject, ...projects]);
        setNewProjectName('');
        setNewProjectClient('');
        setIsNewProjectModalOpen(false);
      }
    } catch (err) {
      console.error("Failed to create project:", err);
    }
  };

  const filteredTasks = tasks.filter(t => {
    const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || t.status === statusFilter;
    const matchesPriority = priorityFilter === 'All' || t.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.status === 'Completed').length,
    inProgress: tasks.filter(t => t.status === 'In Progress').length,
    budget: "₹4,50,000"
  };

  const handleToggleStatus = async (id) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    const nextStatus = task.status === 'Completed' ? 'Todo' : 
                      task.status === 'Todo' ? 'In Progress' : 'Completed';
    
    try {
      const res = await fetch(`/api/tasks/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus })
      });
      if (res.ok) {
        const updatedTask = await res.json();
        setTasks(tasks.map(t => t.id === id ? { ...t, status: updatedTask.status } : t));
      }
    } catch (err) {
      console.error("Failed to toggle status:", err);
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      const res = await fetch(`/api/tasks/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setTasks(tasks.filter(t => t.id !== id));
      }
    } catch (err) {
      console.error("Failed to delete task:", err);
    }
  };

  const handleCreateTask = async () => {
    if (!newTaskTitle) return;

    const newTaskData = {
      title: newTaskTitle,
      status: 'Todo',
      priority: newTaskPriority,
      dueDate: new Date(newTaskDueDate).toLocaleDateString()
    };

    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTaskData)
      });
      if (res.ok) {
        const createdTask = await res.json();
        setTasks([{ ...createdTask, dueDate: newTaskData.dueDate }, ...tasks]);
        setNewTaskTitle('');
        setNewTaskPriority('Medium');
        setNewTaskDueDate(new Date().toISOString().split('T')[0]);
        setIsNewTaskModalOpen(false);
      }
    } catch (err) {
      console.error("Failed to create task:", err);
    }
  };

  const handleUpdateProject = (id, updates) => {
    setProjects(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  useEffect(() => {
    // Check for project reminders
    const now = new Date();
    const newNotifications = [];

    projects.forEach(project => {
      if (project.reminderDaysBefore && project.reminderDaysBefore > 0 && project.status !== 'Completed') {
        const dueDate = new Date(project.dueDate);
        const diffTime = dueDate.getTime() - now.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays <= project.reminderDaysBefore && diffDays >= 0) {
          const notificationId = project.id + 1000; // Offset to avoid collisions
          if (!notifications.find(n => n.id === notificationId)) {
            newNotifications.push({
              id: notificationId,
              title: 'Project Reminder',
              message: `Project "${project.name}" is due in ${diffDays} days. Team: ${project.team.join(', ')}`,
              time: 'Just now',
              type: 'warning'
            });
          }
        }
      }
    });

    if (newNotifications.length > 0) {
      setNotifications(prev => [...newNotifications, ...prev]);
    }
  }, [projects]);

  const renderView = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <DashboardView 
            stats={stats} 
            festivals={festivals} 
            filteredTasks={filteredTasks} 
            onViewAllTasks={() => setActiveTab('tasks')}
            onToggleStatus={handleToggleStatus}
          />
        );
      case 'projects':
        return (
          <ProjectsView 
            projects={projects} 
            onNewProject={() => setIsNewProjectModalOpen(true)} 
            onUpdateProject={handleUpdateProject}
          />
        );
      case 'tasks':
        return (
          <TasksView 
            filteredTasks={filteredTasks} 
            statusFilter={statusFilter} 
            setStatusFilter={setStatusFilter}
            priorityFilter={priorityFilter}
            setPriorityFilter={setPriorityFilter}
            onToggleStatus={handleToggleStatus}
            onDeleteTask={handleDeleteTask}
          />
        );
      case 'calendar':
        return <CalendarView />;
      case 'settings':
        return <SettingsView user={user} onUpdateUser={setUser} />;
      default:
        return (
          <DashboardView 
            stats={stats} 
            festivals={festivals} 
            filteredTasks={filteredTasks} 
            onViewAllTasks={() => setActiveTab('tasks')}
            onToggleStatus={handleToggleStatus}
          />
        );
    }
  };

  return (
    <div 
      key={user.theme}
      className={`flex flex-col h-screen bg-white dark:bg-gray-950 text-[#1A1A1A] dark:text-gray-100 font-sans overflow-hidden transition-colors duration-300 ${user.theme === 'dark' ? 'dark' : ''}`}
    >
      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white dark:bg-gray-900 border-b border-[#E5E7EB] dark:border-gray-800 flex items-center justify-between px-4 lg:px-8 shrink-0">
          <div className="flex items-center gap-8 flex-1">
            <div className="flex items-center gap-3 shrink-0">
              <div className="w-8 h-8 bg-[#F97316] rounded-lg flex items-center justify-center">
                <LayoutDashboard className="text-white w-5 h-5" />
              </div>
              <h1 className="text-xl font-bold tracking-tight dark:text-white hidden sm:block">Core</h1>
            </div>

            <nav className="hidden md:flex items-center gap-1">
              <NavItem 
                icon={<LayoutDashboard size={18} />} 
                label="Dashboard" 
                active={activeTab === 'dashboard'} 
                onClick={() => setActiveTab('dashboard')} 
              />
              <NavItem 
                icon={<Briefcase size={18} />} 
                label="Projects" 
                active={activeTab === 'projects'} 
                onClick={() => setActiveTab('projects')} 
              />
              <NavItem 
                icon={<CheckSquare size={18} />} 
                label="Tasks" 
                active={activeTab === 'tasks'} 
                onClick={() => setActiveTab('tasks')} 
              />
              <NavItem 
                icon={<Calendar size={18} />} 
                label="Calendar" 
                active={activeTab === 'calendar'} 
                onClick={() => setActiveTab('calendar')} 
              />
              <NavItem 
                icon={<Settings size={18} />} 
                label="Settings" 
                active={activeTab === 'settings'} 
                onClick={() => setActiveTab('settings')} 
              />
            </nav>

            <div className="relative w-full max-w-xs hidden lg:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input 
                type="text" 
                placeholder="Search..." 
                className="w-full pl-9 pr-4 py-1.5 bg-[#F3F4F6] dark:bg-gray-800 border-none rounded-xl text-sm focus:ring-2 focus:ring-orange-500 transition-all outline-none dark:text-white"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <div className="flex items-center gap-2 lg:gap-4">
            <button 
              onClick={() => setUser(prev => ({ ...prev, theme: prev.theme === 'dark' ? 'light' : 'dark' }))}
              className="flex items-center gap-2 p-2 px-3 bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-all border border-gray-200 dark:border-gray-700 shadow-sm"
              title={`Switch to ${user.theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              {user.theme === 'dark' ? (
                <Sun size={18} className="text-amber-500" />
              ) : (
                <Moon size={18} className="text-indigo-500" />
              )}
            </button>
            <div className="relative">
              <button 
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors relative"
              >
                <Bell size={20} />
                <span className="absolute top-2 right-2 w-2 h-2 bg-orange-500 rounded-full border-2 border-white dark:border-gray-900" />
              </button>
              
              {isNotificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-xl z-50 overflow-hidden">
                  <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
                    <h4 className="font-bold dark:text-white">Notifications</h4>
                    <span className="text-[10px] bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 px-2 py-0.5 rounded-full font-bold">{notifications.length} TOTAL</span>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {notifications.map(notification => (
                      <div key={notification.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800 border-b border-gray-50 dark:border-gray-800 cursor-pointer">
                        <div className="flex items-center gap-2">
                          {notification.type === 'warning' && <AlertCircle size={14} className="text-amber-500" />}
                          <p className="text-sm font-semibold dark:text-white">{notification.title}</p>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{notification.message}</p>
                        <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-2">{notification.time}</p>
                      </div>
                    ))}
                  </div>
                  <button className="w-full p-3 text-xs font-bold text-gray-400 hover:text-orange-600 border-t border-gray-100 dark:border-gray-800 transition-colors">
                    View all notifications
                  </button>
                </div>
              )}
            </div>
            <div className="h-8 w-px bg-gray-200 dark:bg-gray-800 mx-1 hidden sm:block" />
            <div className="flex items-center gap-2 p-1 pr-3 rounded-full hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors hidden sm:flex">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-orange-500 to-red-500 flex items-center justify-center text-white text-xs font-bold">
                {user.name.split(' ').map(n => n[0]).join('')}
              </div>
              <span className="text-sm font-semibold dark:text-white hidden lg:inline">{user.name}</span>
            </div>
            <button 
              onClick={() => setIsNewTaskModalOpen(true)}
              className="flex items-center gap-2 bg-[#F97316] text-white px-3 lg:px-4 py-2 rounded-xl text-sm font-medium hover:bg-[#EA580C] transition-all shadow-sm ml-2"
            >
              <Plus size={18} />
              <span className="hidden sm:inline">New Task</span>
            </button>
          </div>
        </header>

        {/* View Content */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-8">
          {renderView()}
        </div>
      </main>

      {/* New Task Modal */}
      {isNewTaskModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border border-transparent dark:border-gray-800">
            <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
              <h3 className="text-xl font-bold dark:text-white">Create New Task</h3>
              <button onClick={() => setIsNewTaskModalOpen(false)} className="p-2 text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Task Title</label>
                <input 
                  type="text" 
                  placeholder="e.g., Finalize Q4 Reports" 
                  className="w-full p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:ring-2 focus:ring-orange-500 outline-none transition-all dark:text-white"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Priority</label>
                  <select 
                    className="w-full p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:ring-2 focus:ring-orange-500 outline-none dark:text-white"
                    value={newTaskPriority}
                    onChange={(e) => setNewTaskPriority(e.target.value)}
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Due Date</label>
                  <input 
                    type="date" 
                    className="w-full p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:ring-2 focus:ring-orange-500 outline-none dark:text-white" 
                    value={newTaskDueDate}
                    onChange={(e) => setNewTaskDueDate(e.target.value)}
                  />
                </div>
              </div>
            </div>
            <div className="p-6 bg-gray-50 dark:bg-gray-800/50 flex gap-3 border-t border-gray-100 dark:border-gray-800">
              <button 
                onClick={() => setIsNewTaskModalOpen(false)}
                className="flex-1 py-3 text-sm font-bold text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-all"
              >
                Cancel
              </button>
              <button 
                onClick={handleCreateTask}
                className="flex-1 py-3 text-sm font-bold bg-orange-600 text-white rounded-xl hover:bg-orange-700 transition-all shadow-md active:scale-95"
              >
                Create Task
              </button>
            </div>
          </div>
        </div>
      )}
      {/* New Project Modal */}
      {isNewProjectModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
          <div className="bg-white dark:bg-gray-900 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200 border border-transparent dark:border-gray-800">
            <div className="p-8">
              <h3 className="text-2xl font-bold mb-6 dark:text-white">Create New Project</h3>
              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">Project Name</label>
                  <input 
                    type="text" 
                    value={newProjectName}
                    onChange={(e) => setNewProjectName(e.target.value)}
                    placeholder="Enter project name..."
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all dark:text-white"
                    autoFocus
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">Client Name</label>
                  <input 
                    type="text" 
                    value={newProjectClient}
                    onChange={(e) => setNewProjectClient(e.target.value)}
                    placeholder="Enter client name..."
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all dark:text-white"
                  />
                </div>
              </div>
            </div>
            <div className="p-6 bg-gray-50 dark:bg-gray-800/50 flex gap-3 border-t border-gray-100 dark:border-gray-800">
              <button 
                onClick={() => setIsNewProjectModalOpen(false)}
                className="flex-1 py-3 text-sm font-bold text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-all"
              >
                Cancel
              </button>
              <button 
                onClick={handleCreateProject}
                className="flex-1 py-3 text-sm font-bold bg-orange-600 text-white rounded-xl hover:bg-orange-700 transition-all shadow-md active:scale-95"
              >
                Create Project
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function NavItem({ icon, label, active, onClick }) {
  return (
    <button 
      onClick={onClick}
      className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
        active 
          ? 'bg-[#FFF7ED] dark:bg-orange-950/30 text-[#EA580C]' 
          : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
      }`}
    >
      {icon}
      <span className="hidden lg:inline">{label}</span>
    </button>
  );
}

