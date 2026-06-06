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
import { Plus, Search, Edit, Trash2 } from "lucide-react";
import {
  getAllProjects,
  createProject,
  updateProject,
  deleteProject,
} from "@/server/actions/projects";

interface Project {
  id: string;
  name: string;
  description: string;
  status: string;
  priority: string;
  owner: {
    name: string;
    email: string;
  };
  team: Array<{ name: string; email: string }>;
  startDate: string;
  endDate: string;
  budget?: number;
}

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    status: "planning",
    priority: "medium",
    startDate: new Date().toISOString().split("T")[0],
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
    budget: "",
  });

  // Fetch projects on mount
  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setIsLoading(true);
    try {
      const result = await getAllProjects();
      if (result.success) {
        setProjects(result.projects as any);
      }
    } catch (error) {
      console.error(" Error fetching projects:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddProject = async () => {
    if (!formData.name.trim()) return;

    setIsLoading(true);
    try {
      const userEmail =
        sessionStorage.getItem("userEmail") || "admin@company.com";

      if (editingId) {
        // Update existing project
        const result = await updateProject(editingId, {
          name: formData.name,
          description: formData.description,
          status: formData.status,
          priority: formData.priority,
          endDate: formData.endDate,
          budget: formData.budget ? parseInt(formData.budget) : undefined,
        });

        if (result.success) {
          await fetchProjects();
          setEditingId(null);
        }
      } else {
        // Create new project
        const result = await createProject({
          name: formData.name,
          description: formData.description,
          ownerEmail: userEmail,
          status: formData.status,
          priority: formData.priority,
          startDate: formData.startDate,
          endDate: formData.endDate,
          budget: formData.budget ? parseInt(formData.budget) : undefined,
        });

        if (result.success) {
          await fetchProjects();
        }
      }

      setFormData({
        name: "",
        description: "",
        status: "planning",
        priority: "medium",
        startDate: new Date().toISOString().split("T")[0],
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0],
        budget: "",
      });
      setIsModalOpen(false);
    } catch (error) {
      console.error(" Error saving project:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenEdit = (project: Project) => {
    setEditingId(project.id);
    setFormData({
      name: project.name,
      description: project.description,
      status: project.status,
      priority: project.priority,
      startDate: project.startDate?.split("T")[0] || "",
      endDate: project.endDate?.split("T")[0] || "",
      budget: project.budget?.toString() || "",
    });
    setIsModalOpen(true);
  };

  const handleDeleteProject = async (id: string) => {
    setIsLoading(true);
    try {
      const result = await deleteProject(id);
      if (result.success) {
        await fetchProjects();
      }
    } catch (error) {
      console.error(" Error deleting project:", error);
    } finally {
      setIsLoading(false);
      setDeleteConfirm(null);
    }
  };

  const filteredProjects = projects.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.owner.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.owner.email.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "in-progress":
        return "success";
      case "on-hold":
        return "warning";
      case "completed":
        return "default";
      case "planning":
        return "secondary";
      default:
        return "default";
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">All Projects</h1>
          <p className="text-muted-foreground mt-1">
            Manage all projects in the system
          </p>
        </div>
        <Button
          onClick={() => {
            setEditingId(null);
            setFormData({
              name: "",
              description: "",
              status: "planning",
              priority: "medium",
              startDate: new Date().toISOString().split("T")[0],
              endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
                .toISOString()
                .split("T")[0],
              budget: "",
            });
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2"
        >
          <Plus size={20} />
          New Project
        </Button>
      </div>

      {/* Search Bar */}
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
            size={20}
          />
          <Input
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProjects.map((project) => (
          <Card key={project.id} className="flex flex-col">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle>{project.name}</CardTitle>
                  <CardDescription className="mt-1">
                    {project.owner.name}
                  </CardDescription>
                </div>
                <Badge variant={getStatusColor(project.status) as any}>
                  {project.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="flex-1 space-y-4">
              <p className="text-sm text-foreground">{project.description}</p>

              {/* Info */}
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <p className="text-muted-foreground">Priority</p>
                  <p className="font-medium capitalize">{project.priority}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Team</p>
                  <p className="font-medium">{project.team.length} members</p>
                </div>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <p className="text-muted-foreground">Start</p>
                  <p className="font-medium">
                    {new Date(project.startDate).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">End</p>
                  <p className="font-medium">
                    {new Date(project.endDate).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Actions - Admin can always edit and delete */}
              <div className="flex gap-2 pt-2 border-t border-border">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleOpenEdit(project)}
                  className="flex-1 flex items-center gap-2"
                  disabled={isLoading}
                >
                  <Edit size={16} />
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => setDeleteConfirm(project.id)}
                  className="flex-1 flex items-center gap-2"
                  disabled={isLoading}
                >
                  <Trash2 size={16} />
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredProjects.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-muted-foreground">No projects found</p>
          </CardContent>
        </Card>
      )}

      {/* Create/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingId(null);
          setFormData({
            name: "",
            description: "",
            status: "planning",
            priority: "medium",
            startDate: new Date().toISOString().split("T")[0],
            endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
              .toISOString()
              .split("T")[0],
            budget: "",
          });
        }}
        title={editingId ? "Edit Project" : "Create New Project"}
        actions={
          <>
            <Button
              variant="outline"
              onClick={() => {
                setIsModalOpen(false);
                setEditingId(null);
                setFormData({
                  name: "",
                  description: "",
                  status: "planning",
                  priority: "medium",
                  startDate: new Date().toISOString().split("T")[0],
                  endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
                    .toISOString()
                    .split("T")[0],
                  budget: "",
                });
              }}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button onClick={handleAddProject} disabled={isLoading}>
              {editingId ? "Update" : "Create"}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input
            label="Project Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Enter project name"
            disabled={isLoading}
          />
          <Textarea
            label="Description"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            placeholder="Enter project description"
            rows={4}
            disabled={isLoading}
          />
          <Select
            label="Status"
            value={formData.status}
            onChange={(e) =>
              setFormData({ ...formData, status: e.target.value })
            }
            options={[
              { value: "planning", label: "Planning" },
              { value: "in-progress", label: "In Progress" },
              { value: "on-hold", label: "On Hold" },
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
          <Input
            label="Start Date"
            type="date"
            value={formData.startDate}
            onChange={(e) =>
              setFormData({ ...formData, startDate: e.target.value })
            }
            disabled={isLoading}
          />
          <Input
            label="End Date"
            type="date"
            value={formData.endDate}
            onChange={(e) =>
              setFormData({ ...formData, endDate: e.target.value })
            }
            disabled={isLoading}
          />
          <Input
            label="Budget"
            type="number"
            value={formData.budget}
            onChange={(e) =>
              setFormData({ ...formData, budget: e.target.value })
            }
            placeholder="Enter budget amount"
            disabled={isLoading}
          />
        </div>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={deleteConfirm !== null}
        title="Delete Project"
        message="Are you sure you want to delete this project? This action cannot be undone."
        confirmText="Delete"
        isDangerous={true}
        onConfirm={() => deleteConfirm && handleDeleteProject(deleteConfirm)}
        onCancel={() => setDeleteConfirm(null)}
      />
    </div>
  );
}
