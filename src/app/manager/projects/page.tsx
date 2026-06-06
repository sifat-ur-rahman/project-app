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
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Plus, Search, Edit, AlertCircle } from "lucide-react";
import {
  getAllProjects,
  createProject,
  updateProject,
  getProjectsByOwner,
} from "@/server/actions/projects";

export default function ManagerProjectsPage() {
  const [userEmail, setUserEmail] = useState("");
  const [projects, setProjects] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
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

  useEffect(() => {
    const email = sessionStorage.getItem("userEmail");
    setUserEmail(email || "");
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setIsLoading(true);
    const email = sessionStorage.getItem("userEmail");
    try {
      const result = await getProjectsByOwner(email || "");
      if (result.success) {
        setProjects(result.projects || []);
      }
    } catch (err) {
      setError("Failed to load projects");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveProject = async () => {
    if (!formData.name.trim()) return;
    const userEmail = sessionStorage.getItem("userEmail");
    setIsLoading(true);
    try {
      if (editingId) {
        await updateProject(editingId, {
          name: formData.name,
          description: formData.description,
          status: formData.status,
          priority: formData.priority,
          endDate: formData.endDate,
          budget: formData.budget ? parseInt(formData.budget) : undefined,
        });
      } else {
        await createProject({
          name: formData.name,
          description: formData.description,
          ownerEmail: userEmail || "",
          status: formData.status,
          priority: formData.priority,
          startDate: formData.startDate,
          endDate: formData.endDate,
          budget: formData.budget ? parseInt(formData.budget) : undefined,
        });
      }
      await fetchProjects();
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
    } catch (err) {
      setError("Failed to save project");
    } finally {
      setIsLoading(false);
    }
  };

  const filteredProjects = projects.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">My Projects</h1>
          <p className="text-muted-foreground mt-1">
            {projects.length} projects from database
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
          disabled={isLoading}
        >
          <Plus size={20} />
          New Project
        </Button>
      </div>

      {error && (
        <Card className="border-destructive bg-destructive/10">
          <CardContent className="pt-6 flex gap-3">
            <AlertCircle className="text-destructive flex-shrink-0" />
            <p className="text-sm text-muted-foreground">{error}</p>
          </CardContent>
        </Card>
      )}

      {/* Search */}
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
            disabled={isLoading}
          />
        </div>
      </div>

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-muted-foreground">
              {projects.length === 0
                ? "No projects created yet"
                : "No projects matching search"}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProjects.map((project) => (
            <Card key={project._id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{project.name}</CardTitle>
                  <Badge
                    variant={
                      project.status === "completed" ? "success" : "default"
                    }
                  >
                    {project.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  {project.description}
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setEditingId(project.id);
                      setFormData({
                        name: project.name,
                        description: project.description || "",
                        status: project.status,
                        priority: project.priority || "medium",
                        startDate: project.startDate
                          ? project.startDate.split("T")[0]
                          : new Date().toISOString().split("T")[0],
                        endDate: project.endDate
                          ? project.endDate.split("T")[0]
                          : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
                              .toISOString()
                              .split("T")[0],
                        budget: project.budget ? String(project.budget) : "",
                      });
                      setIsModalOpen(true);
                    }}
                    disabled={isLoading}
                  >
                    <Edit size={16} />
                    Edit
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Modal */}
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
        title={editingId ? "Edit Project" : "New Project"}
        actions={
          <>
            <Button
              variant="outline"
              onClick={() => setIsModalOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveProject}
              disabled={isLoading || !formData.name.trim()}
            >
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
          <div className="flex gap-4">
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
              ]}
              disabled={isLoading}
            />
          </div>
          <div className="flex gap-4">
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
          </div>
          <Input
            label="Budget"
            type="number"
            value={formData.budget}
            onChange={(e) =>
              setFormData({ ...formData, budget: e.target.value })
            }
            placeholder="Enter project budget"
            disabled={isLoading}
          />
        </div>
      </Modal>
    </div>
  );
}
