import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // In-memory task store
  let tasks = [
    { id: 1, title: "GST Filing - Q4", status: "In Progress", priority: "High" },
    { id: 2, title: "Mumbai Branch Launch", status: "Todo", priority: "High" },
    { id: 3, title: "Diwali Marketing Campaign", status: "Completed", priority: "Medium" },
    { id: 4, title: "Bengaluru Tech Meetup", status: "Todo", priority: "Low" },
    { id: 5, title: "Team Lunch - Biryani Feast", status: "Completed", priority: "Low" },
  ];

  // In-memory project store
  let projects = [
    {
      id: 1,
      name: 'Mumbai Branch Launch',
      client: 'Core Corp',
      progress: 65,
      status: 'Active',
      team: ['AS', 'RK', 'MP'],
      dueDate: 'Apr 15, 2026'
    },
    {
      id: 2,
      name: 'E-commerce Redesign',
      client: 'Vastra Fashion',
      progress: 30,
      status: 'Active',
      team: ['AS', 'JL'],
      dueDate: 'May 20, 2026'
    },
    {
      id: 3,
      name: 'GST Compliance Module',
      client: 'Internal',
      progress: 100,
      status: 'Completed',
      team: ['AS', 'SN', 'VK'],
      dueDate: 'Mar 10, 2026'
    },
    {
      id: 4,
      name: 'Mobile App Beta',
      client: 'Tech Solutions',
      progress: 15,
      status: 'On Hold',
      team: ['AS', 'DP'],
      dueDate: 'Jun 05, 2026'
    }
  ];

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", message: "Core Server is active" });
  });

  // Project APIs
  app.get("/api/projects", (req, res) => {
    res.json(projects);
  });

  app.post("/api/projects", (req, res) => {
    const newProject = {
      id: projects.length > 0 ? Math.max(...projects.map(p => p.id)) + 1 : 1,
      progress: 0,
      team: ['AS'],
      ...req.body
    };
    projects = [newProject, ...projects];
    res.status(201).json(newProject);
  });

  // Task APIs
  app.get("/api/tasks", (req, res) => {
    res.json(tasks);
  });

  app.post("/api/tasks", (req, res) => {
    const newTask = {
      id: tasks.length > 0 ? Math.max(...tasks.map(t => t.id)) + 1 : 1,
      ...req.body
    };
    tasks = [newTask, ...tasks];
    res.status(201).json(newTask);
  });

  app.patch("/api/tasks/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const index = tasks.findIndex(t => t.id === id);
    if (index !== -1) {
      tasks[index] = { ...tasks[index], ...req.body };
      res.json(tasks[index]);
    } else {
      res.status(404).json({ error: "Task not found" });
    }
  });

  app.delete("/api/tasks/:id", (req, res) => {
    const id = parseInt(req.params.id);
    tasks = tasks.filter(t => t.id !== id);
    res.status(204).send();
  });

  app.get("/api/festivals", (req, res) => {
    res.json([
      { name: "Ram Navami", date: "March 27, 2026", type: "Regional" },
      { name: "Good Friday", date: "April 03, 2026", type: "Public" },
      { name: "Ambedkar Jayanti", date: "April 14, 2026", type: "National" },
    ]);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Core Server running on http://localhost:${PORT}`);
  });
}

startServer();
