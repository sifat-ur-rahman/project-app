"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  CheckCircle2,
  Circle,
  AlertCircle,
} from "lucide-react";
import {
  getAllTasks,
  createTask,
  updateTask,
  deleteTask,
  updateTaskStatus,
} from "@/server/actions/tasks";
import { getAllTeamMembers } from "@/server/actions/team";
import { getAllProjects } from "@/server/actions/projects";

/**
 * Admin Tasks Management Page
 *
 * Full task management with real database integration:
 * - Create tasks in MongoDB
 * - Edit any task
 * - Delete any task
 * - View all tasks from database
 * - Assign tasks to team members
 * - Real-time status updates
 */

export default function AdminTasksPage() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    projectId: "",
    assigneeEmail: "",
    status: "pending",
    priority: "medium",
    dueDate: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [tasksResult, teamResult, projectsResult] = await Promise.all([
        getAllTasks(),
        getAllTeamMembers(),
        getAllProjects(),
      ]);

      if (tasksResult.success) {
        setTasks(tasksResult.tasks || []);
      }
      if (teamResult.success) {
        setTeamMembers(teamResult.members || []);
      }
      if (projectsResult.success) {
        setProjects(projectsResult.projects || []);
      }
    } catch (err) {
      console.error("[v0] Error fetching data:", err);
      setError("Failed to load tasks");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddTask = async () => {
    if (!formData.title.trim()) return;
    const userEmail =
      sessionStorage.getItem("userEmail") || "admin@company.com";
    console.log("form Data", formData);
    setIsLoading(true);
    try {
      if (editingId) {
        const result = await updateTask(editingId, {
          title: formData.title,
          description: formData.description,
          assigneeEmail: formData.assigneeEmail,
          status: formData.status,
          priority: formData.priority,
          dueDate: formData.dueDate,
        });
        console.log("updateTask result:", result);
        if (result.success) {
          await fetchData();
          setEditingId(null);
        }
      } else {
        const result = await createTask({
          title: formData.title,
          description: formData.description,
          projectId: formData.projectId,
          assigneeEmail: formData.assigneeEmail,
          status: formData.status,
          priority: formData.priority,
          dueDate: formData.dueDate,
          projectName: "",
          createdByEmail: userEmail,
        });
        console.log("createTask result:", result);
        if (result.success) {
          await fetchData();
        }
      }

      setFormData({
        title: "",
        description: "",
        projectId: "",
        assigneeEmail: "",
        status: "pending",
        priority: "medium",
        dueDate: "",
      });
      setIsModalOpen(false);
    } catch (err) {
      console.error("[v0] Error saving task:", err);
      setError("Failed to save task");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenEdit = (task: any) => {
    setEditingId(task._id || task.id);
    setFormData({
      title: task.title,
      description: task.description || "",
      projectId: task.projectId || "",
      assigneeEmail: task.assignee?.email || "",
      status: task.status,
      priority: task.priority,
      dueDate: task.dueDate?.split("T")[0] || "",
    });
    setIsModalOpen(true);
  };

  const handleDeleteTask = async (id: string) => {
    setIsLoading(true);
    try {
      const result = await deleteTask(id);
      if (result.success) {
        await fetchData();
      }
    } catch (err) {
      console.error("[v0] Error deleting task:", err);
      setError("Failed to delete task");
    } finally {
      setIsLoading(false);
      setDeleteConfirm(null);
    }
  };

  const handleToggleStatus = async (taskId: string, currentStatus: string) => {
    const newStatus = currentStatus === "completed" ? "pending" : "completed";
    try {
      const result = await updateTaskStatus(taskId, newStatus);
      if (result.success) {
        await fetchData();
      }
    } catch (err) {
      console.error("[v0] Error updating task status:", err);
    }
  };

  let filteredTasks = tasks.filter((t) => {
    const searchMatch =
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.assignee?.name || "")
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
    return searchMatch;
  });

  if (filterStatus !== "all") {
    filteredTasks = filteredTasks.filter((t) => t.status === filterStatus);
  }

  if (filterPriority !== "all") {
    filteredTasks = filteredTasks.filter((t) => t.priority === filterPriority);
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical":
        return "error";
      case "high":
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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">All Tasks</h1>
            <p className="text-muted-foreground mt-1">Loading tasks...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">All Tasks</h1>
          <p className="text-muted-foreground mt-1">
            {tasks.length} tasks from database
          </p>
        </div>
        <Button
          onClick={() => {
            setEditingId(null);
            setFormData({
              title: "",
              description: "",
              projectId: "",
              assigneeEmail: "",
              status: "pending",
              priority: "medium",
              dueDate: "",
            });
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2"
          disabled={isLoading}
        >
          <Plus size={20} />
          New Task
        </Button>
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
        <div className="flex-1 min-w-64 relative">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
            size={20}
          />
          <Input
            placeholder="Search tasks by title, description, or assignee..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
            disabled={isLoading}
          />
        </div>
        <div className="flex gap-2">
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
          <Select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            options={[
              { value: "all", label: "All Priorities" },
              { value: "low", label: "Low" },
              { value: "medium", label: "Medium" },
              { value: "high", label: "High" },
              { value: "critical", label: "Critical" },
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
                  ? "No tasks in database"
                  : "No tasks matching filters"}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredTasks.map((task) => (
            <Card key={task._id || task.id}>
              <CardContent className="py-4">
                <div className="flex items-center justify-between gap-4">
                  <button
                    onClick={() =>
                      handleToggleStatus(task._id || task.id, task.status)
                    }
                    className="flex-shrink-0 text-muted-foreground hover:text-primary"
                    disabled={isLoading}
                  >
                    {task.status === "completed" ? (
                      <CheckCircle2 size={24} className="text-green-600" />
                    ) : (
                      <Circle size={24} />
                    )}
                  </button>

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
                      <span>{task.projectId || "No project"}</span>
                      <span>•</span>
                      <span>{task.assignee?.name || "Unassigned"}</span>
                    </div>
                    {task.description && (
                      <p className="text-sm text-muted-foreground mt-1 truncate">
                        {task.description}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 flex-wrap justify-end min-w-max">
                    <Badge variant={getPriorityColor(task.priority) as any}>
                      {task.priority}
                    </Badge>
                    <Badge variant={getStatusColor(task.status) as any}>
                      {task.status}
                    </Badge>
                    {task.dueDate && (
                      <span className="text-sm text-muted-foreground">
                        {new Date(task.dueDate).toLocaleDateString()}
                      </span>
                    )}
                  </div>

                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleOpenEdit(task)}
                      disabled={isLoading}
                    >
                      <Edit size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setDeleteConfirm(task._id || task.id)}
                      disabled={isLoading}
                    >
                      <Trash2 size={16} className="text-destructive" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Create/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingId(null);
          setFormData({
            title: "",
            description: "",
            projectId: "",
            assigneeEmail: "",
            status: "pending",
            priority: "medium",
            dueDate: "",
          });
        }}
        title={editingId ? "Edit Task" : "Create New Task"}
        size="lg"
        actions={
          <>
            <Button
              variant="outline"
              onClick={() => {
                setIsModalOpen(false);
                setEditingId(null);
                setFormData({
                  title: "",
                  description: "",
                  projectId: "",
                  assigneeEmail: "",
                  status: "pending",
                  priority: "medium",
                  dueDate: "",
                });
              }}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddTask}
              disabled={isLoading || !formData.title.trim()}
            >
              {editingId ? "Update" : "Create"}
            </Button>
          </>
        }
      >
        <div className="space-y-4 ">
          <Input
            label="Task Title"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            placeholder="Enter task title"
            disabled={isLoading}
          />
          <Textarea
            label="Description"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            placeholder="Enter task description"
            rows={3}
            disabled={isLoading}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Project"
              value={formData.projectId}
              onChange={(e) =>
                setFormData({ ...formData, projectId: e.target.value })
              }
              options={[
                { value: "", label: "Select a project..." },
                ...projects.map((p) => ({ value: p.id, label: p.name })),
              ]}
              disabled={isLoading}
            />
            <Select
              label="Assignee"
              value={formData.assigneeEmail}
              onChange={(e) =>
                setFormData({ ...formData, assigneeEmail: e.target.value })
              }
              options={[
                { value: "", label: "Unassigned" },
                ...teamMembers.map((m) => ({ value: m.email, label: m.name })),
              ]}
              disabled={isLoading}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Status"
              value={formData.status}
              onChange={(e) =>
                setFormData({ ...formData, status: e.target.value })
              }
              options={[
                { value: "pending", label: "Pending" },
                { value: "in-progress", label: "In Progress" },
                { value: "completed", label: "Completed" },
              ]}
              disabled={isLoading}
            />
            <Select
              label="Priority"
              value={formData.priority}
              onChange={(e) =>
                setFormData({ ...formData, priority: e.target.value })
              }
              options={[
                { value: "low", label: "Low" },
                { value: "medium", label: "Medium" },
                { value: "high", label: "High" },
                { value: "critical", label: "Critical" },
              ]}
              disabled={isLoading}
            />
          </div>
          <Input
            type="date"
            label="Due Date"
            value={formData.dueDate}
            onChange={(e) =>
              setFormData({ ...formData, dueDate: e.target.value })
            }
            disabled={isLoading}
          />
        </div>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={deleteConfirm !== null}
        title="Delete Task"
        message="Are you sure you want to delete this task? This action cannot be undone."
        confirmText="Delete"
        isDangerous={true}
        onConfirm={() => deleteConfirm && handleDeleteTask(deleteConfirm)}
        onCancel={() => setDeleteConfirm(null)}
      />
    </div>
  );
}
