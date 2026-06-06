"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { AlertCircle, TrendingUp } from "lucide-react";
import { getAllProjects } from "@/server/actions/projects";
import { getAllTasks } from "@/server/actions/tasks";
import { getAllTeamMembers } from "@/server/actions/team";

export default function AdminAnalyticsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [projects, setProjects] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  const fetchAnalyticsData = async () => {
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
      console.error(" Error fetching analytics data:", err);
      setError("Failed to load analytics");
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate metrics from real data
  const totalProjects = projects.length;
  const completedProjects = projects.filter(
    (p) => p.status === "completed",
  ).length;
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === "completed").length;
  const inProgressTasks = tasks.filter(
    (t) => t.status === "in-progress",
  ).length;
  const completionRate =
    totalProjects > 0
      ? Math.round((completedProjects / totalProjects) * 100)
      : 0;

  // Group tasks by priority
  const tasksByPriority = {
    critical: tasks.filter((t) => t.priority === "critical").length,
    high: tasks.filter((t) => t.priority === "high").length,
    medium: tasks.filter((t) => t.priority === "medium").length,
    low: tasks.filter((t) => t.priority === "low").length,
  };

  const priorityData = [
    { name: "Critical", value: tasksByPriority.critical, fill: "#dc2626" },
    { name: "High", value: tasksByPriority.high, fill: "#ea580c" },
    { name: "Medium", value: tasksByPriority.medium, fill: "#f59e0b" },
    { name: "Low", value: tasksByPriority.low, fill: "#10b981" },
  ].filter((item) => item.value > 0);

  // Sort projects by name for trend (showing recent projects)
  const projectTrendData = projects
    .sort(
      (a, b) =>
        new Date(b.createdAt || 0).getTime() -
        new Date(a.createdAt || 0).getTime(),
    )
    .slice(0, 6)
    .reverse()
    .map((p, idx) => ({
      name: p.name.substring(0, 15),
      progress:
        p.status === "completed" ? 100 : p.status === "in-progress" ? 50 : 10,
    }));

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Analytics</h1>
          <p className="text-muted-foreground mt-1">
            Loading system-wide metrics...
          </p>
        </div>
      </div>
    );
  }
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Analytics</h1>
        <p className="text-muted-foreground mt-1">
          System-wide metrics from database
        </p>
      </div>

      {/* Error State */}
      {error && (
        <Card className="border-destructive bg-destructive/10">
          <CardContent className="pt-6 flex gap-3">
            <AlertCircle className="text-destructive flex-shrink-0" />
            <div>
              <p className="font-medium text-destructive">
                Error loading analytics
              </p>
              <p className="text-sm text-muted-foreground">{error}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Total Projects
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProjects}</div>
            <p className="text-xs text-muted-foreground mt-1">From database</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedProjects}</div>
            <p className="text-xs text-green-600 mt-1">
              {completionRate}% completion rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTasks}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {completedTasks} completed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Team Members</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{teamMembers.length}</div>
            <p className="text-xs text-muted-foreground mt-1">All active</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Project Progress Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Project Progress</CardTitle>
            <CardDescription>
              Real projects from database (latest 6)
            </CardDescription>
          </CardHeader>
          <CardContent>
            {projectTrendData.length === 0 ? (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                No projects available
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={projectTrendData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="var(--color-border)"
                  />
                  <XAxis
                    dataKey="name"
                    stroke="var(--color-muted-foreground)"
                    angle={-45}
                    height={80}
                  />
                  <YAxis stroke="var(--color-muted-foreground)" />
                  <Tooltip />
                  <Bar dataKey="progress" fill="var(--color-primary)" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Task Priority Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Task Priority Distribution</CardTitle>
            <CardDescription>Real tasks from database</CardDescription>
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
                    data={priorityData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {priorityData.map((entry, index) => (
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

      {/* Detailed Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Projects by Status */}
        <Card>
          <CardHeader>
            <CardTitle>Projects by Status</CardTitle>
            <CardDescription>Real project breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            {projects.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4">No projects</p>
            ) : (
              <div className="space-y-3">
                {projects.slice(0, 5).map((project, index) => (
                  <div key={index}>
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-medium truncate">
                        {project.name}
                      </p>
                      <p className="text-xs text-muted-foreground capitalize ml-2 flex-shrink-0">
                        {project.status}
                      </p>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full"
                        style={{
                          width: `${
                            project.status === "completed"
                              ? 100
                              : project.status === "in-progress"
                                ? 60
                                : project.status === "on-hold"
                                  ? 30
                                  : 10
                          }%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Team Task Assignment */}
        <Card>
          <CardHeader>
            <CardTitle>Team Activity</CardTitle>
            <CardDescription>Tasks assigned per team member</CardDescription>
          </CardHeader>
          <CardContent>
            {teamMembers.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4">
                No team members
              </p>
            ) : (
              <div className="space-y-3">
                {teamMembers.slice(0, 5).map((member, index) => {
                  const memberTaskCount = tasks.filter(
                    (t) => t.assignee?.email === member.email,
                  ).length;
                  return (
                    <div
                      key={index}
                      className="flex items-center justify-between"
                    >
                      <p className="text-sm font-medium">{member.name}</p>
                      <div className="flex items-center gap-2">
                        <div className="text-sm text-muted-foreground">
                          {memberTaskCount} tasks
                        </div>
                        <div className="w-20 bg-muted rounded-full h-2">
                          <div
                            className="bg-primary h-2 rounded-full"
                            style={{
                              width: `${Math.min(
                                100,
                                (memberTaskCount / Math.max(1, totalTasks)) *
                                  100,
                              )}%`,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
