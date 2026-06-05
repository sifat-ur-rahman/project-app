"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import {
  Plus,
  Search,
  Edit,
  CheckCircle2,
  Circle,
  AlertCircle,
} from "lucide-react";
import {
  getAllTasks,
  createTask,
  updateTask,
  updateTaskStatus,
} from "@/server/actions/tasks";
import { getAllTeamMembers } from "@/server/actions/team";
import { getAllProjects } from "@/server/actions/projects";

/**
 * Manager (PM) Tasks Management Page
 *
 * PM task management with database integration:
 * - Create/edit tasks in own projects
 * - Assign to team members
 * - No delete (admin only)
 * - Real data from MongoDB
 */

export default function ManagerTasksPage() {
  const [userEmail, setUserEmail] = useState("");
  const [tasks, setTasks] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
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
    const email = sessionStorage.getItem("userEmail");
    setUserEmail(email || "");
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [tasksR, projectsR, teamR] = await Promise.all([
        getAllTasks(),
        getAllProjects(),
        getAllTeamMembers(),
      ]);
      if (tasksR.success) setTasks(tasksR.tasks || []);
      if (projectsR.success && userEmail) {
        setProjects(
          (projectsR.projects || []).filter(
            (p) => p.owner?.email === userEmail,
          ),
        );
      }
      if (teamR.success) setTeamMembers(teamR.members || []);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveTask = async () => {
    if (!formData.title.trim()) return;
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
      await fetchData();
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
    } finally {
      setIsLoading(false);
    }
  };

  // Filter tasks for PM's projects only
  const myProjectIds = projects.map((p) => p._id);
  const myTasks = tasks
    .filter((t) => myProjectIds.includes(t.projectId))
    .filter((t) => t.title.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Tasks</h1>
          <p className="text-muted-foreground mt-1">
            {myTasks.length} tasks in my projects
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

      <div className="flex gap-2">
        <div className="flex-1 relative">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
            size={20}
          />
          <Input
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
            disabled={isLoading}
          />
        </div>
      </div>

      <div className="space-y-2">
        {myTasks.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-muted-foreground">No tasks in your projects</p>
            </CardContent>
          </Card>
        ) : (
          myTasks.map((task) => (
            <Card key={task._id}>
              <CardContent className="py-4">
                <div className="flex items-center justify-between gap-4">
                  <button
                    onClick={() =>
                      updateTaskStatus(
                        task._id,
                        task.status === "completed" ? "pending" : "completed",
                      ).then(() => fetchData())
                    }
                    className="flex-shrink-0"
                  >
                    {task.status === "completed" ? (
                      <CheckCircle2 size={24} className="text-green-600" />
                    ) : (
                      <Circle size={24} />
                    )}
                  </button>
                  <div className="flex-1 min-w-0">
                    <p
                      className={`font-medium ${task.status === "completed" ? "line-through text-muted-foreground" : ""}`}
                    >
                      {task.title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {task.assignee?.name || "Unassigned"}
                    </p>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <Badge
                      variant={task.priority === "high" ? "error" : "default"}
                    >
                      {task.priority}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setEditingId(task._id);
                        setFormData({
                          title: task.title,
                          description: task.description || "",
                          projectId: task.projectId,
                          assigneeEmail: task.assignee?.email || "",
                          status: task.status,
                          priority: task.priority,
                          dueDate: task.dueDate
                            ? new Date(task.dueDate).toISOString().split("T")[0]
                            : "",
                        });
                        setIsModalOpen(true);
                      }}
                      disabled={isLoading}
                    >
                      <Edit size={16} />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? "Edit Task" : "New Task"}
        actions={
          <>
            <Button
              variant="outline"
              onClick={() => setIsModalOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button onClick={handleSaveTask} disabled={isLoading}>
              Save
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input
            label="Title"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            placeholder="Task title"
            disabled={isLoading}
          />
          <Textarea
            label="Description"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            placeholder="Description"
            rows={3}
            disabled={isLoading}
          />
          <Select
            label="Project"
            value={formData.projectId}
            onChange={(e) =>
              setFormData({ ...formData, projectId: e.target.value })
            }
            options={[
              { value: "", label: "Select..." },
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
            ]}
            disabled={isLoading}
          />
          <Input
            label="Due Date"
            type="date"
            value={formData.dueDate}
            onChange={(e) =>
              setFormData({ ...formData, dueDate: e.target.value })
            }
            disabled={isLoading}
          />
        </div>
      </Modal>
    </div>
  );
}
