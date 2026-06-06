"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { FolderOpen, CheckSquare, TrendingUp, AlertCircle } from "lucide-react";
import { getAllProjects } from "@/server/actions/projects";
import { getAllTasks } from "@/server/actions/tasks";

/**
 * Manager (PM) Dashboard Page
 *
 * Project-focused overview with real database:
 * - My projects count (filtered by ownerEmail)
 * - My team's tasks overview
 * - Completion rate for my projects
 * - Charts based on real data
 */

export default function ManagerDashboardPage() {
  const [userEmail, setUserEmail] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [projects, setProjects] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const email = sessionStorage.getItem("userEmail");
    setUserEmail(email || "pm@company.com");
    if (email) {
      fetchManagerData(email);
    }
  }, []);

  const fetchManagerData = async (pmEmail: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const [projectsResult, tasksResult] = await Promise.all([
        getAllProjects(),
        getAllTasks(),
      ]);

      if (projectsResult.success) {
        // Filter projects owned by PM
        const myProjects = (projectsResult.projects || []).filter(
          (p) => p.owner?.email === pmEmail,
        );
        setProjects(myProjects);
      }
      if (tasksResult.success) {
        setTasks(tasksResult.tasks || []);
      }
    } catch (err) {
      console.error(" Error fetching manager data:", err);
      setError("Failed to load dashboard");
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate metrics from real data
  const myProjectsCount = projects.length;
  const myTasksCount = tasks.filter((t) =>
    projects.map((p) => p.id).includes(t.projectId),
  ).length;
  const completedTasks = tasks.filter(
    (t) =>
      t.status === "completed" &&
      projects.map((p) => p.id).includes(t.projectId),
  ).length;
  const completionRate =
    myTasksCount > 0 ? Math.round((completedTasks / myTasksCount) * 100) : 0;

  // Task status breakdown for my projects
  const inProgressTasks = tasks.filter(
    (t) =>
      t.status === "in-progress" &&
      projects.map((p) => p.id).includes(t.projectId),
  ).length;
  const pendingTasks = tasks.filter(
    (t) =>
      t.status === "pending" && projects.map((p) => p.id).includes(t.projectId),
  ).length;

  const taskStatusData = [
    { name: "Completed", value: completedTasks, fill: "#22c55e" },
    { name: "In Progress", value: inProgressTasks, fill: "#3b82f6" },
    { name: "Pending", value: pendingTasks, fill: "#f59e0b" },
  ].filter((item) => item.value > 0);

  // Project status breakdown
  const projectsByStatus = {
    planning: projects.filter((p) => p.status === "planning").length,
    "in-progress": projects.filter((p) => p.status === "in-progress").length,
    "on-hold": projects.filter((p) => p.status === "on-hold").length,
    completed: projects.filter((p) => p.status === "completed").length,
  };

  const projectStatusData = [
    { name: "Planning", projects: projectsByStatus["planning"] },
    { name: "In Progress", projects: projectsByStatus["in-progress"] },
    { name: "On Hold", projects: projectsByStatus["on-hold"] },
    { name: "Completed", projects: projectsByStatus["completed"] },
  ];

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Project Manager Dashboard
          </h1>
          <p className="text-muted-foreground">Loading your projects...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Project Manager Dashboard
        </h1>
        <p className="text-muted-foreground">
          Your projects and team overview from database
        </p>
      </div>

      {/* Error State */}
      {error && (
        <Card className="border-destructive bg-destructive/10">
          <CardContent className="pt-6 flex gap-3">
            <AlertCircle className="text-destructive flex-shrink-0" />
            <div>
              <p className="font-medium text-destructive">
                Error loading dashboard
              </p>
              <p className="text-sm text-muted-foreground">{error}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats Cards - PM Specific View */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* My Projects */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">My Projects</CardTitle>
              <FolderOpen size={20} className="text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{myProjectsCount}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Currently managing
            </p>
          </CardContent>
        </Card>

        {/* Team Tasks */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Team Tasks</CardTitle>
              <CheckSquare size={20} className="text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{myTasksCount}</div>
            <p className="text-xs text-muted-foreground mt-1">In my projects</p>
          </CardContent>
        </Card>

        {/* Completion Rate */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">
                Completion Rate
              </CardTitle>
              <TrendingUp size={20} className="text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completionRate}%</div>
            <Badge
              variant={completionRate >= 60 ? "success" : "secondary"}
              className="mt-1"
            >
              {completionRate >= 60 ? "On track" : "In progress"}
            </Badge>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Projects by Status */}
        <Card>
          <CardHeader>
            <CardTitle>My Projects by Status</CardTitle>
            <CardDescription>Real projects from database</CardDescription>
          </CardHeader>
          <CardContent>
            {projects.length === 0 ? (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                No projects yet
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={projectStatusData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="var(--color-border)"
                  />
                  <XAxis
                    dataKey="name"
                    stroke="var(--color-muted-foreground)"
                  />
                  <YAxis stroke="var(--color-muted-foreground)" />
                  <Tooltip />
                  <Bar dataKey="projects" fill="var(--color-primary)" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Task Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Task Status Distribution</CardTitle>
            <CardDescription>Tasks in my projects</CardDescription>
          </CardHeader>
          <CardContent>
            {myTasksCount === 0 ? (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                No tasks yet
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={taskStatusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {taskStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Projects */}
      <Card>
        <CardHeader>
          <CardTitle>My Recent Projects</CardTitle>
          <CardDescription>Latest projects from database</CardDescription>
        </CardHeader>
        <CardContent>
          {projects.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4">
              No projects created yet
            </p>
          ) : (
            <div className="space-y-3">
              {projects.slice(0, 5).map((project, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between py-2 border-b border-border last:border-0"
                >
                  <div>
                    <p className="text-sm font-medium">{project.name}</p>
                    <p className="text-xs text-muted-foreground capitalize">
                      {project.status}
                    </p>
                  </div>
                  <Badge
                    variant={
                      project.status === "completed" ? "success" : "default"
                    }
                    className="text-white"
                  >
                    {tasks.filter((t) => t.projectId === project.id).length}{" "}
                    tasks
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
