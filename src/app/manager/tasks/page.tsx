'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Modal } from '@/components/ui/modal';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { Plus, Search, Edit, CheckCircle2, Circle } from 'lucide-react';

/**
 * Manager (PM) Tasks Management Page
 * 
 * Task management with PM permissions:
 * - Create tasks
 * - Edit tasks
 * - NO delete (admin only)
 * - Assign tasks to team members
 * - Toggle task status
 */

interface Task {
  id: string;
  title: string;
  project: string;
  assignee: string;
  assigneeEmail: string;
  status: 'pending' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
}

const initialTasks: Task[] = [
  {
    id: '1',
    title: 'Design Homepage',
    project: 'Website Redesign',
    assignee: 'Sarah Chen',
    assigneeEmail: 'sarah@company.com',
    status: 'in-progress',
    priority: 'high',
    dueDate: '2024-11-30',
  },
  {
    id: '2',
    title: 'Setup Database',
    project: 'Mobile App',
    assignee: 'John Smith',
    assigneeEmail: 'john@company.com',
    status: 'pending',
    priority: 'high',
    dueDate: '2024-12-05',
  },
  {
    id: '3',
    title: 'API Documentation',
    project: 'API Integration',
    assignee: 'Emily Davis',
    assigneeEmail: 'emily@company.com',
    status: 'in-progress',
    priority: 'medium',
    dueDate: '2024-11-20',
  },
];

export default function ManagerTasksPage() {
  const [tasks, setTasks] = useState(initialTasks);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    project: '',
    assignee: '',
    status: 'pending' as const,
    priority: 'medium' as const,
    dueDate: '',
  });

  const handleAddTask = () => {
    if (formData.title.trim()) {
      if (editingId) {
        setTasks(tasks.map(t => 
          t.id === editingId ? { ...t, ...formData, assigneeEmail: tasks.find(x => x.id === editingId)?.assigneeEmail || '' } : t
        ));
        setEditingId(null);
      } else {
        const newTask: Task = {
          id: Date.now().toString(),
          title: formData.title,
          project: formData.project || 'Unassigned',
          assignee: formData.assignee || 'Unassigned',
          assigneeEmail: '',
          status: formData.status,
          priority: formData.priority,
          dueDate: formData.dueDate,
        };
        setTasks([newTask, ...tasks]);
      }
      setFormData({ title: '', project: '', assignee: '', status: 'pending', priority: 'medium', dueDate: '' });
      setIsModalOpen(false);
    }
  };

  const handleOpenEdit = (task: Task) => {
    setEditingId(task.id);
    setFormData({
      title: task.title,
      project: task.project,
      assignee: task.assignee,
      status: task.status,
      priority: task.priority,
      dueDate: task.dueDate,
    });
    setIsModalOpen(true);
  };

  const handleToggleStatus = (id: string) => {
    setTasks(tasks.map(t =>
      t.id === id
        ? { ...t, status: t.status === 'completed' ? 'pending' : 'completed' }
        : t
    ));
  };

  let filteredTasks = tasks.filter(t => {
    const searchMatch = t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.project.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.assignee.toLowerCase().includes(searchQuery.toLowerCase());
    return searchMatch;
  });

  if (filterStatus !== 'all') {
    filteredTasks = filteredTasks.filter(t => t.status === filterStatus);
  }

  if (filterPriority !== 'all') {
    filteredTasks = filteredTasks.filter(t => t.priority === filterPriority);
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'error';
      case 'medium':
        return 'warning';
      case 'low':
        return 'success';
      default:
        return 'default';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'in-progress':
        return 'info';
      case 'pending':
        return 'warning';
      default:
        return 'default';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Tasks</h1>
          <p className="text-muted-foreground mt-1">Manage your team tasks - Create and edit only</p>
        </div>
        <Button
          onClick={() => {
            setEditingId(null);
            setFormData({ title: '', project: '', assignee: '', status: 'pending', priority: 'medium', dueDate: '' });
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2"
        >
          <Plus size={20} />
          New Task
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex gap-2 flex-wrap">
        <div className="flex-1 min-w-64 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
          <Input
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          options={[
            { value: 'all', label: 'All Statuses' },
            { value: 'pending', label: 'Pending' },
            { value: 'in-progress', label: 'In Progress' },
            { value: 'completed', label: 'Completed' },
          ]}
        />
        <Select
          value={filterPriority}
          onChange={(e) => setFilterPriority(e.target.value)}
          options={[
            { value: 'all', label: 'All Priorities' },
            { value: 'low', label: 'Low' },
            { value: 'medium', label: 'Medium' },
            { value: 'high', label: 'High' },
          ]}
        />
      </div>

      {/* Permission Note */}
      <div className="p-3 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded">
        <p className="text-sm text-blue-900 dark:text-blue-200">
          You can create and edit tasks, but cannot delete. Contact an admin to delete tasks.
        </p>
      </div>

      {/* Tasks List */}
      <div className="space-y-2">
        {filteredTasks.map((task) => (
          <Card key={task.id}>
            <CardContent className="py-4">
              <div className="flex items-center justify-between gap-4">
                <button
                  onClick={() => handleToggleStatus(task.id)}
                  className="flex-shrink-0 text-muted-foreground hover:text-primary"
                >
                  {task.status === 'completed' ? (
                    <CheckCircle2 size={24} className="text-green-600" />
                  ) : (
                    <Circle size={24} />
                  )}
                </button>

                <div className="flex-1 min-w-0">
                  <p className={`font-medium ${task.status === 'completed' ? 'line-through text-muted-foreground' : ''}`}>
                    {task.title}
                  </p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                    <span>{task.project}</span>
                    <span>•</span>
                    <span>{task.assignee}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-wrap justify-end">
                  <Badge variant={getPriorityColor(task.priority) as any}>
                    {task.priority}
                  </Badge>
                  <Badge variant={getStatusColor(task.status) as any}>
                    {task.status}
                  </Badge>
                  <span className="text-sm text-muted-foreground">{new Date(task.dueDate).toLocaleDateString()}</span>
                </div>

                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleOpenEdit(task)}
                  >
                    <Edit size={16} />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredTasks.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-muted-foreground">No tasks found</p>
          </CardContent>
        </Card>
      )}

      {/* Create/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingId(null);
          setFormData({ title: '', project: '', assignee: '', status: 'pending', priority: 'medium', dueDate: '' });
        }}
        title={editingId ? 'Edit Task' : 'Create New Task'}
        actions={
          <>
            <Button
              variant="outline"
              onClick={() => {
                setIsModalOpen(false);
                setEditingId(null);
                setFormData({ title: '', project: '', assignee: '', status: 'pending', priority: 'medium', dueDate: '' });
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleAddTask}>
              {editingId ? 'Update' : 'Create'}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input
            label="Task Title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="Enter task title"
          />
          <Input
            label="Project"
            value={formData.project}
            onChange={(e) => setFormData({ ...formData, project: e.target.value })}
            placeholder="Enter project name"
          />
          <Input
            label="Assignee"
            value={formData.assignee}
            onChange={(e) => setFormData({ ...formData, assignee: e.target.value })}
            placeholder="Enter assignee name"
          />
          <Select
            label="Status"
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
            options={[
              { value: 'pending', label: 'Pending' },
              { value: 'in-progress', label: 'In Progress' },
              { value: 'completed', label: 'Completed' },
            ]}
          />
          <Select
            label="Priority"
            value={formData.priority}
            onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
            options={[
              { value: 'low', label: 'Low' },
              { value: 'medium', label: 'Medium' },
              { value: 'high', label: 'High' },
            ]}
          />
          <Input
            type="date"
            label="Due Date"
            value={formData.dueDate}
            onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
          />
        </div>
      </Modal>
    </div>
  );
}
