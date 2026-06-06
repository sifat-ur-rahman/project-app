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
import {
  Users,
  FolderOpen,
  CheckSquare,
  TrendingUp,
  AlertCircle,
} from "lucide-react";
import { getAllProjects } from "@/server/actions/projects";
import { getAllTasks } from "@/server/actions/tasks";
import { getAllTeamMembers } from "@/server/actions/team";

export default function AdminDashboardPage() {
  const [userEmail, setUserEmail] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [projects, setProjects] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const email = sessionStorage.getItem("userEmail");
    setUserEmail(email || "admin@company.com");
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [projectsResult, tasksResult, teamResult] = await Promise.all([
        getAllProjects(),
        getAllTasks(),
        getAllTeamMembers(),
      ]);

      if (projectsResult.success) {
        setProjects(projectsResult.projects || []);
      }
      if (tasksResult.success) {
        setTasks(tasksResult.tasks || []);
      }
      if (teamResult.success) {
        setTeamMembers(teamResult.members || []);
      }
    } catch (err) {
      console.error(" Error fetching dashboard data:", err);
      setError("Failed to load dashboard data");
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate metrics from real data
  const totalProjects = projects.length;
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === "completed").length;
  const inProgressTasks = tasks.filter(
    (t) => t.status === "in-progress",
  ).length;
  const pendingTasks = tasks.filter((t) => t.status === "pending").length;
  const completionRate =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  const totalTeamMembers = teamMembers.length;

  // Transform data for charts
  const taskStatusData = [
    { name: "Completed", value: completedTasks, fill: "#22c55e" },
    { name: "In Progress", value: inProgressTasks, fill: "#3b82f6" },
    { name: "Pending", value: pendingTasks, fill: "#f59e0b" },
  ].filter((item) => item.value > 0);

  // Group projects by status for chart
  const projectsByStatus = {
    planning: projects.filter((p) => p.status === "planning").length,
    "in-progress": projects.filter((p) => p.status === "in-progress").length,
    "on-hold": projects.filter((p) => p.status === "on-hold").length,
    completed: projects.filter((p) => p.status === "completed").length,
  };

  const projectStatusData = [
    { name: "Planning", value: projectsByStatus["planning"] },
    { name: "In Progress", value: projectsByStatus["in-progress"] },
    { name: "On Hold", value: projectsByStatus["on-hold"] },
    { name: "Completed", value: projectsByStatus["completed"] },
  ];

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Admin Dashboard
          </h1>
          <p className="text-muted-foreground">
            Full system overview and management
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <div className="h-4 bg-muted rounded w-24" />
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-muted rounded w-12 mb-2" />
                <div className="h-3 bg-muted rounded w-32" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Admin Dashboard
        </h1>
        <p className="text-muted-foreground">
          Full system overview from database ({projects.length} projects,{" "}
          {totalTasks} tasks)
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

      {/* Stats Cards - Full System View */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Projects */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">
                Total Projects
              </CardTitle>
              <FolderOpen size={20} className="text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProjects}</div>
            <p className="text-xs text-muted-foreground mt-1">From database</p>
          </CardContent>
        </Card>

        {/* All Tasks */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">All Tasks</CardTitle>
              <CheckSquare size={20} className="text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTasks}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {completedTasks} completed
            </p>
          </CardContent>
        </Card>

        {/* Team Members */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">
                Team Members
              </CardTitle>
              <Users size={20} className="text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTeamMembers}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Total active members
            </p>
          </CardContent>
        </Card>

        {/* Overall Rate */}
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
        {/* Project Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Projects by Status</CardTitle>
            <CardDescription>Real project data from database</CardDescription>
          </CardHeader>
          <CardContent>
            {projects.length === 0 ? (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                No projects available
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
                  <Bar dataKey="value" fill="var(--color-primary)" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Task Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Task Status Distribution</CardTitle>
            <CardDescription>Real task breakdown from database</CardDescription>
          </CardHeader>
          <CardContent>
            {tasks.length === 0 ? (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                No tasks available
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

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>
            Latest projects and tasks from database
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {projects.length === 0 && tasks.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4">
                No activity yet
              </p>
            ) : (
              <>
                {/* Show recent projects */}
                {projects.slice(0, 3).map((project, index) => (
                  <div
                    key={`proj-${index}`}
                    className="flex items-center justify-between py-2 border-b border-border last:border-0"
                  >
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        <span className="text-muted-foreground">
                          {project.owner?.name || "Unknown"}
                        </span>{" "}
                        created project{" "}
                        <span className="font-medium">{project.name}</span>
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Status:{" "}
                        <span className="capitalize">{project.status}</span>
                      </p>
                    </div>
                  </div>
                ))}
                {/* Show recent tasks */}
                {tasks.slice(0, 2).map((task, index) => (
                  <div
                    key={`task-${index}`}
                    className="flex items-center justify-between py-2 border-b border-border last:border-0"
                  >
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        <span className="text-muted-foreground">
                          {task.assignee?.name || "Unassigned"}
                        </span>{" "}
                        assigned task{" "}
                        <span className="font-medium">{task.title}</span>
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Priority:{" "}
                        <span className="capitalize">{task.priority}</span>
                      </p>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
