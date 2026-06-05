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
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { CheckSquare, Clock, AlertCircle } from "lucide-react";
import { getTasksByAssigneeEmail } from "@/server/actions/tasks";

export default function MemberDashboardPage() {
  const [userName, setUserName] = useState("");
  const [tasks, setTasks] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const email = sessionStorage.getItem("userEmail");
    const name =
      sessionStorage.getItem("userName") ||
      (email
        ? email.split("@")[0].charAt(0).toUpperCase() +
          email.split("@")[0].slice(1)
        : "Team Member");

    setUserName(name);
    if (email) fetchMyTasks(email);
  }, []);

  const fetchMyTasks = async (memberEmail: string) => {
    setIsLoading(true);
    try {
      const result = await getTasksByAssigneeEmail(memberEmail || "");
      if (result.success) {
        setTasks(result.tasks || []);
      }
    } catch (err) {
      console.error("[v0] Error fetching tasks:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate metrics from real data
  const completedTasks = tasks.filter((t) => t.status === "completed").length;
  const inProgressTasks = tasks.filter(
    (t) => t.status === "in-progress",
  ).length;
  const pendingTasks = tasks.filter((t) => t.status === "pending").length;
  const completionRate =
    tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0;

  const myTasksData = [
    { name: "Completed", value: completedTasks, fill: "#22c55e" },
    { name: "In Progress", value: inProgressTasks, fill: "#3b82f6" },
    { name: "Pending", value: pendingTasks, fill: "#f59e0b" },
  ].filter((item) => item.value > 0);

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Welcome, {userName}
          </h1>
          <p className="text-muted-foreground">Loading your tasks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Welcome, {userName}
        </h1>
        <p className="text-muted-foreground">
          {tasks.length} assigned tasks from database
        </p>
      </div>

      {/* Stats Cards - Member Specific View */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* My Assigned Tasks */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">My Tasks</CardTitle>
              <CheckSquare size={20} className="text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tasks.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Total assigned to you
            </p>
          </CardContent>
        </Card>

        {/* In Progress */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">In Progress</CardTitle>
              <Clock size={20} className="text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inProgressTasks}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Currently working on
            </p>
          </CardContent>
        </Card>

        {/* My Completion Rate */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">
                Completion Rate
              </CardTitle>
              <AlertCircle size={20} className="text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completionRate}%</div>
            <Badge
              variant={completionRate >= 50 ? "success" : "warning"}
              className="mt-1"
            >
              {completedTasks} of {tasks.length} completed
            </Badge>
          </CardContent>
        </Card>
      </div>

      {/* My Tasks Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Task Status Chart */}
        <Card>
          <CardHeader>
            <CardTitle>My Task Status</CardTitle>
            <CardDescription>Real task breakdown from database</CardDescription>
          </CardHeader>
          <CardContent>
            {tasks.length === 0 ? (
              <div className="h-64 flex items-center justify-center text-muted-foreground">
                No tasks assigned yet
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={myTasksData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {myTasksData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Recent Tasks */}
        <Card>
          <CardHeader>
            <CardTitle>My Recent Tasks</CardTitle>
            <CardDescription>
              Latest assigned tasks from database
            </CardDescription>
          </CardHeader>
          <CardContent>
            {tasks.length === 0 ? (
              <p className="text-muted-foreground">No tasks assigned yet</p>
            ) : (
              <div className="space-y-3">
                {tasks.slice(0, 4).map((task) => (
                  <div
                    key={task._id}
                    className="flex items-center justify-between py-2 border-b border-border last:border-0"
                  >
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {task.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Priority: {task.priority}
                      </p>
                    </div>
                    <Badge
                      variant={
                        task.status === "completed" ? "success" : "default"
                      }
                    >
                      {task.status}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Info */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Info</CardTitle>
          <CardDescription>Important reminders</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="p-3 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded">
              <p className="text-sm font-medium text-blue-900 dark:text-blue-200">
                You can only view and update your assigned tasks
              </p>
            </div>
            <div className="p-3 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded">
              <p className="text-sm font-medium text-green-900 dark:text-green-200">
                Update your task status regularly to keep your manager informed
              </p>
            </div>
            <div className="p-3 bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded">
              <p className="text-sm font-medium text-amber-900 dark:text-amber-200">
                All data is loaded from the database in real-time
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
