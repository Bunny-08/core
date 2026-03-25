import React, { useState, useEffect, useMemo } from 'react';
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
  AlertCircle,
  Shield
} from 'lucide-react';

import DashboardView from './components/DashboardView';
import TasksView from './components/TasksView';
import CalendarView from './components/CalendarView';
import SettingsView from './components/SettingsView';
import ProjectsView from './components/ProjectsView';
import AdminView from './components/AdminView';

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
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [adminError, setAdminError] = useState('');

  useEffect(() => {
    if (window.location.pathname === '/admin') {
      setActiveTab('admin');
    }
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;

    if (user.theme === 'dark') {
      root.classList.add('dark');
      body.classList.add('dark');
    } else {
      root.classList.remove('dark');
      body.classList.remove('dark');
    }
  }, [user.theme]);

  useEffect(() => {
    fetch('/api/tasks')
      .then(res => res.json())
      .then(data => {
        const enriched = data.map(t => ({
          ...t,
          dueDate: t.dueDate || new Date().toLocaleDateString()
        }));
        setTasks(enriched);
      });

    fetch('/api/festivals')
      .then(res => res.json())
      .then(setFestivals);

    fetch('/api/projects')
      .then(res => res.json())
      .then(setProjects);
  }, []);

  const filteredTasks = useMemo(() => {
    return tasks.filter(t =>
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (statusFilter === 'All' || t.status === statusFilter) &&
      (priorityFilter === 'All' || t.priority === priorityFilter)
    );
  }, [tasks, searchQuery, statusFilter, priorityFilter]);

  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.status === 'Completed').length,
    inProgress: tasks.filter(t => t.status === 'In Progress').length,
    budget: "₹4,50,000"
  };

  const handleCreateTask = async () => {
    if (!newTaskTitle) return;

    const newTask = {
      title: newTaskTitle,
      status: 'Todo',
      priority: newTaskPriority,
      dueDate: new Date(newTaskDueDate).toLocaleDateString()
    };

    const res = await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newTask)
    });

    if (res.ok) {
      const created = await res.json();
      setTasks([created, ...tasks]);
      setIsNewTaskModalOpen(false);
      setNewTaskTitle('');
    }
  };

  const handleAdminLogin = () => {
    if (adminEmail === 'admin@example.com' && adminPassword === 'password123') {
      setIsAdminAuthenticated(true);
      setAdminError('');
    } else {
      setAdminError('Invalid credentials');
    }
  };

  const renderView = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardView stats={stats} festivals={festivals} filteredTasks={filteredTasks} />;
      case 'projects':
        return <ProjectsView projects={projects} />;
      case 'tasks':
        return <TasksView filteredTasks={filteredTasks} />;
      case 'calendar':
        return <CalendarView />;
      case 'settings':
        return <SettingsView user={user} onUpdateUser={setUser} />;
      case 'admin':
        if (!isAdminAuthenticated) {
          return (
            <div className="p-6">
              <input placeholder="Email" onChange={(e)=>setAdminEmail(e.target.value)} />
              <input type="password" placeholder="Password" onChange={(e)=>setAdminPassword(e.target.value)} />
              <button onClick={handleAdminLogin}>Login</button>
              {adminError && <p>{adminError}</p>}
            </div>
          );
        }
        return <AdminView stats={stats} />;
      default:
        return null;
    }
  };

  return (
    <div className="h-screen flex flex-col">
      <header className="flex justify-between p-4 border-b">
        <h1>Core</h1>

        <div className="flex gap-2">
          <button onClick={() =>
            setUser(prev => ({
              ...prev,
              theme: prev.theme === 'dark' ? 'light' : 'dark'
            }))
          }>
            {user.theme === 'dark' ? <Sun /> : <Moon />}
          </button>

          <button onClick={() => setIsNewTaskModalOpen(true)}>
            <Plus /> New Task
          </button>
        </div>
      </header>

      <main className="flex-1 p-4 overflow-auto">
        {renderView()}
      </main>

      {isNewTaskModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40">
          <div className="bg-white p-4 rounded">
            <input 
              placeholder="Task title"
              value={newTaskTitle}
              onChange={(e)=>setNewTaskTitle(e.target.value)}
            />
            <button onClick={handleCreateTask}>Create</button>
            <button onClick={()=>setIsNewTaskModalOpen(false)}>
              <X />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function NavItem({ icon, label, active, onClick }) {
  return (
    <button onClick={onClick}>
      {icon} {label}
    </button>
  );
}
