'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Modal } from '@/components/ui/modal';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { Plus, Search, Edit, Trash2 } from 'lucide-react';

/**
 * Admin Projects Management Page
 * 
 * Full project management with all permissions:
 * - Create new projects
 * - Edit any project
 * - Delete any project
 * - View all projects
 */

interface Project {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'on-hold' | 'completed';
  owner: string;
  ownerEmail: string;
  members: number;
  progress: number;
  dueDate: string;
}

const initialProjects: Project[] = [
  {
    id: '1',
    name: 'Website Redesign',
    description: 'Complete redesign of the company website',
    status: 'active',
    owner: 'Sarah Chen',
    ownerEmail: 'sarah@company.com',
    members: 4,
    progress: 65,
    dueDate: '2024-12-31',
  },
  {
    id: '2',
    name: 'Mobile App Development',
    description: 'Native iOS and Android app',
    status: 'active',
    owner: 'John Smith',
    ownerEmail: 'john@company.com',
    members: 6,
    progress: 45,
    dueDate: '2025-03-15',
  },
  {
    id: '3',
    name: 'API Integration',
    description: 'Backend API for third-party services',
    status: 'on-hold',
    owner: 'Emily Davis',
    ownerEmail: 'emily@company.com',
    members: 3,
    progress: 25,
    dueDate: '2025-02-28',
  },
];

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState(initialProjects);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: 'active' as const,
  });

  const handleAddProject = () => {
    if (formData.name.trim()) {
      if (editingId) {
        setProjects(projects.map(p => 
          p.id === editingId ? { ...p, ...formData } : p
        ));
        setEditingId(null);
      } else {
        const newProject: Project = {
          id: Date.now().toString(),
          name: formData.name,
          description: formData.description,
          status: formData.status,
          owner: 'You',
          ownerEmail: sessionStorage.getItem('userEmail') || 'admin@company.com',
          members: 1,
          progress: 0,
          dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        };
        setProjects([newProject, ...projects]);
      }
      setFormData({ name: '', description: '', status: 'active' });
      setIsModalOpen(false);
    }
  };

  const handleOpenEdit = (project: Project) => {
    setEditingId(project.id);
    setFormData({
      name: project.name,
      description: project.description,
      status: project.status,
    });
    setIsModalOpen(true);
  };

  const handleDeleteProject = (id: string) => {
    setProjects(projects.filter(p => p.id !== id));
    setDeleteConfirm(null);
  };

  const filteredProjects = projects.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.owner.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'on-hold':
        return 'warning';
      case 'completed':
        return 'default';
      default:
        return 'default';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">All Projects</h1>
          <p className="text-muted-foreground mt-1">Manage all projects in the system</p>
        </div>
        <Button
          onClick={() => {
            setEditingId(null);
            setFormData({ name: '', description: '', status: 'active' });
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
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
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
                  <CardDescription className="mt-1">{project.owner}</CardDescription>
                </div>
                <Badge variant={getStatusColor(project.status) as any}>
                  {project.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="flex-1 space-y-4">
              <p className="text-sm text-foreground">{project.description}</p>
              
              {/* Progress */}
              <div>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-medium">{project.progress}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full"
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
              </div>

              {/* Info */}
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <p className="text-muted-foreground">Members</p>
                  <p className="font-medium">{project.members}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Due</p>
                  <p className="font-medium">{new Date(project.dueDate).toLocaleDateString()}</p>
                </div>
              </div>

              {/* Actions - Admin can always edit and delete */}
              <div className="flex gap-2 pt-2 border-t border-border">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleOpenEdit(project)}
                  className="flex-1 flex items-center gap-2"
                >
                  <Edit size={16} />
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => setDeleteConfirm(project.id)}
                  className="flex-1 flex items-center gap-2"
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
          setFormData({ name: '', description: '', status: 'active' });
        }}
        title={editingId ? 'Edit Project' : 'Create New Project'}
        actions={
          <>
            <Button
              variant="outline"
              onClick={() => {
                setIsModalOpen(false);
                setEditingId(null);
                setFormData({ name: '', description: '', status: 'active' });
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleAddProject}>
              {editingId ? 'Update' : 'Create'}
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
          />
          <Textarea
            label="Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Enter project description"
            rows={4}
          />
          <Select
            label="Status"
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
            options={[
              { value: 'active', label: 'Active' },
              { value: 'on-hold', label: 'On Hold' },
              { value: 'completed', label: 'Completed' },
            ]}
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
