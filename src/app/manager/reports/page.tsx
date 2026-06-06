"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Badge } from "@/components/ui/badge";
import { AlertCircle } from "lucide-react";
import { getAllProjects, getProjectsByOwner } from "@/server/actions/projects";
import { getAllTasks } from "@/server/actions/tasks";

export default function ManagerReportsPage() {
  const [userEmail, setUserEmail] = useState("");
  const [projects, setProjects] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const email = sessionStorage.getItem("userEmail");
    setUserEmail(email || "");
    fetchData(email || "");
  }, []);

  const fetchData = async (pmEmail: string) => {
    setIsLoading(true);
    try {
      const projectsResult = await getProjectsByOwner(pmEmail || ""); // getAllProjects);
      if (projectsResult.success) {
        setProjects(projectsResult.projects || []);
      }
      const tasksResult = await getAllTasks();
      if (tasksResult.success) {
        setTasks(tasksResult.tasks || []);
      }
    } catch (err) {
      setError("Failed to load reports");
    } finally {
      setIsLoading(false);
    }
  };

  const myProjectIds = projects.map((p) => p.id);
  const myTasks = tasks.filter((t) => myProjectIds.includes(t.projectId));

  const tasksByStatus = {
    completed: myTasks.filter((t) => t.status === "completed").length,
    "in-progress": myTasks.filter((t) => t.status === "in-progress").length,
    pending: myTasks.filter((t) => t.status === "pending").length,
  };

  const chartData = [
    { name: "Completed", value: tasksByStatus.completed, fill: "#22c55e" },
    {
      name: "In Progress",
      value: tasksByStatus["in-progress"],
      fill: "#3b82f6",
    },
    { name: "Pending", value: tasksByStatus.pending, fill: "#f59e0b" },
  ].filter((item) => item.value > 0);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Reports</h1>
        <p className="text-muted-foreground mt-1">
          Your project analytics from database
        </p>
      </div>

      {error && (
        <Card className="border-destructive bg-destructive/10">
          <CardContent className="pt-6 flex gap-3">
            <AlertCircle className="text-destructive" />
            <p className="text-sm">{error}</p>
          </CardContent>
        </Card>
      )}

      {isLoading ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            Loading reports...
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-6">
                <p className="text-sm text-muted-foreground">My Projects</p>
                <p className="text-2xl font-bold">{projects.length}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <p className="text-sm text-muted-foreground">Total Tasks</p>
                <p className="text-2xl font-bold">{myTasks.length}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <p className="text-sm text-muted-foreground">Completion Rate</p>
                <p className="text-2xl font-bold">
                  {myTasks.length > 0
                    ? Math.round(
                        (tasksByStatus.completed / myTasks.length) * 100,
                      )
                    : 0}
                  %
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Task Distribution</CardTitle>
              <CardDescription>Real task data from my projects</CardDescription>
            </CardHeader>
            <CardContent>
              {chartData.length === 0 ? (
                <div className="h-64 flex items-center justify-center text-muted-foreground">
                  No tasks yet
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={80}
                      dataKey="value"
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>My Projects</CardTitle>
            </CardHeader>
            <CardContent>
              {projects.length === 0 ? (
                <p className="text-muted-foreground">No projects created</p>
              ) : (
                <div className="space-y-3">
                  {projects.map((p, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between pb-2 border-b border-border last:border-0"
                    >
                      <div>
                        <p className="font-medium">{p.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {myTasks.filter((t) => t.projectId === p.id).length}{" "}
                          tasks
                        </p>
                      </div>
                      <Badge
                        variant={
                          p.status === "completed" ? "success" : "default"
                        }
                      >
                        {p.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
