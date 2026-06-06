"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import { Select } from "@/components/ui/select";
import { Search, CheckCircle2, Circle, AlertCircle } from "lucide-react";
import {
  getTasksByAssigneeEmail,
  updateTaskStatus,
} from "@/server/actions/tasks";

export default function MemberTasksPage() {
  const [userEmail, setUserEmail] = useState("");
  const [tasks, setTasks] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const email = sessionStorage.getItem("userEmail");
    setUserEmail(email || "");
    if (email) fetchMyTasks(email);
  }, []);

  const fetchMyTasks = async (memberEmail: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await getTasksByAssigneeEmail(memberEmail || "");
      if (result.success) {
        setTasks(result.tasks || []);
      }
    } catch (err) {
      console.error(" Error fetching tasks:", err);
      setError("Failed to load tasks");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateStatus = async (taskId: string, newStatus: string) => {
    try {
      const result = await updateTaskStatus(taskId, newStatus);
      if (result.success) {
        await fetchMyTasks(userEmail);
        setIsModalOpen(false);
        setSelectedTask(null);
      }
    } catch (err) {
      console.error(" Error updating status:", err);
      setError("Failed to update task");
    }
  };

  const handleToggleStatus = async (taskId: string, currentStatus: string) => {
    const newStatus = currentStatus === "completed" ? "pending" : "completed";
    await handleUpdateStatus(taskId, newStatus);
  };

  let filteredTasks = tasks.filter(
    (t) =>
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  if (filterStatus !== "all") {
    filteredTasks = filteredTasks.filter((t) => t.status === filterStatus);
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
      case "critical":
        return "error";
      case "medium":
        return "warning";
      case "low":
        return "success";
      default:
        return "default";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "success";
      case "in-progress":
        return "info";
      case "pending":
        return "warning";
      default:
        return "default";
    }
  };

  if (isLoading && tasks.length === 0) {
    return (
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">My Tasks</h1>
          <p className="text-muted-foreground mt-1">
            Loading your assigned tasks...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">My Tasks</h1>
        <p className="text-muted-foreground mt-1">
          {tasks.length} tasks assigned to you from database
        </p>
      </div>

      {/* Error State */}
      {error && (
        <Card className="border-destructive bg-destructive/10">
          <CardContent className="pt-6 flex gap-3">
            <AlertCircle className="text-destructive flex-shrink-0" />
            <div>
              <p className="font-medium text-destructive">Error</p>
              <p className="text-sm text-muted-foreground">{error}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search and Filters */}
      <div className="flex gap-2 flex-wrap">
        <div className="flex-1  relative">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
            size={20}
          />
          <Input
            placeholder="Search your tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
            disabled={isLoading}
          />
        </div>
        <div className="w-48">
          <Select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            options={[
              { value: "all", label: "All Statuses" },
              { value: "pending", label: "Pending" },
              { value: "in-progress", label: "In Progress" },
              { value: "completed", label: "Completed" },
            ]}
            disabled={isLoading}
          />
        </div>
      </div>

      {/* Tasks List */}
      <div className="space-y-2">
        {filteredTasks.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-muted-foreground">
                {tasks.length === 0
                  ? "No tasks assigned to you yet"
                  : "No tasks matching filters"}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredTasks.map((task, index) => (
            <Card key={index}>
              <CardContent className="py-4">
                <div className="flex items-center justify-between gap-4">
                  {/* Status Toggle */}
                  <button
                    onClick={() => handleToggleStatus(task.id, task.status)}
                    className="flex-shrink-0 text-muted-foreground hover:text-primary"
                    disabled={isLoading}
                    title={`Click to mark as ${task.status === "completed" ? "pending" : "completed"}`}
                  >
                    {task.status === "completed" ? (
                      <CheckCircle2 size={24} className="text-green-600" />
                    ) : (
                      <Circle size={24} />
                    )}
                  </button>

                  {/* Task Info */}
                  <div className="flex-1 min-w-0">
                    <p
                      className={`font-medium ${
                        task.status === "completed"
                          ? "line-through text-muted-foreground"
                          : ""
                      }`}
                    >
                      {task.title}
                    </p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                      {task.description && (
                        <span className="truncate">{task.description}</span>
                      )}
                    </div>
                  </div>

                  {/* Badges and Due Date */}
                  <div className="flex items-center gap-2 flex-wrap justify-end min-w-max">
                    <Badge variant={getPriorityColor(task.priority)}>
                      {task.priority}
                    </Badge>
                    <Badge variant={getStatusColor(task.status)}>
                      {task.status}
                    </Badge>
                    {task.dueDate && (
                      <span className="text-sm text-muted-foreground">
                        {new Date(task.dueDate).toLocaleDateString()}
                      </span>
                    )}
                  </div>

                  {/* Status Update Button */}
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => {
                      setSelectedTask(task);
                      setIsModalOpen(true);
                    }}
                    disabled={isLoading}
                    className=""
                  >
                    Update Status
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Status Update Modal */}
      <Modal
        isOpen={isModalOpen && selectedTask}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedTask(null);
        }}
        title="Update Task Status"
        actions={
          <>
            <Button
              variant="outline"
              onClick={() => {
                setIsModalOpen(false);
                setSelectedTask(null);
              }}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={() =>
                selectedTask &&
                handleUpdateStatus(selectedTask.id, selectedTask.status)
              }
              disabled={isLoading}
            >
              Update
            </Button>
          </>
        }
      >
        {selectedTask && (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Task</label>
              <p className="text-sm text-muted-foreground mt-1">
                {selectedTask.title}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium ">Priority : </label>
              <Badge variant={getPriorityColor(selectedTask.priority)}>
                {selectedTask.priority}
              </Badge>
            </div>
            <div>
              <label className="text-sm font-medium">New Status</label>
              <Select
                value={selectedTask.status}
                onChange={(e) =>
                  setSelectedTask({ ...selectedTask, status: e.target.value })
                }
                options={[
                  { value: "pending", label: "Pending" },
                  { value: "in-progress", label: "In Progress" },
                  { value: "completed", label: "Completed" },
                ]}
                disabled={isLoading}
              />
            </div>
            <div className="p-3 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded">
              <p className="text-sm text-blue-900 dark:text-blue-200">
                You can only update the status of your assigned tasks. Other
                team members will see this update.
              </p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
