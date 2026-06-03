'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Modal } from '@/components/ui/modal';
import { Select } from '@/components/ui/select';
import { Search, Edit, CheckCircle2, Circle } from 'lucide-react';

/**
 * Member Tasks Page
 * 
 * Limited task access for team members:
 * - View only assigned tasks
 * - Edit status of assigned tasks
 * - NO create, NO delete, NO assignment
 * - Cannot create new tasks
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
    title: 'API Integration',
    project: 'Website Redesign',
    assignee: 'member',
    assigneeEmail: 'member@company.com',
    status: 'in-progress',
    priority: 'high',
    dueDate: '2024-11-30',
  },
  {
    id: '2',
    title: 'Code Review',
    project: 'Mobile App',
    assignee: 'member',
    assigneeEmail: 'member@company.com',
    status: 'pending',
    priority: 'medium',
    dueDate: '2024-12-05',
  },
  {
    id: '3',
    title: 'Testing',
    project: 'API Integration',
    assignee: 'member',
    assigneeEmail: 'member@company.com',
    status: 'completed',
    priority: 'medium',
    dueDate: '2024-11-20',
  },
];

export default function MemberTasksPage() {
  const [tasks, setTasks] = useState(initialTasks);
  const [currentUserEmail, setCurrentUserEmail] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [newStatus, setNewStatus] = useState('pending');

  useEffect(() => {
    const email = sessionStorage.getItem('userEmail');
    setCurrentUserEmail(email || 'member@company.com');
  }, []);

  // Only show tasks assigned to current user
  let filteredTasks = tasks.filter(t => {
    const isAssigned = t.assigneeEmail === currentUserEmail;
    const searchMatch = t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.project.toLowerCase().includes(searchQuery.toLowerCase());
    return isAssigned && searchMatch;
  });

  if (filterStatus !== 'all') {
    filteredTasks = filteredTasks.filter(t => t.status === filterStatus);
  }

  const handleOpenEdit = (task: Task) => {
    setEditingTask(task);
    setNewStatus(task.status);
    setIsModalOpen(true);
  };

  const handleUpdateStatus = () => {
    if (editingTask) {
      setTasks(tasks.map(t =>
        t.id === editingTask.id
          ? { ...t, status: newStatus as any }
          : t
      ));
      setIsModalOpen(false);
      setEditingTask(null);
    }
  };

  const handleToggleStatus = (id: string) => {
    setTasks(tasks.map(t =>
      t.id === id
        ? { ...t, status: t.status === 'completed' ? 'pending' : 'completed' }
        : t
    ));
  };

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
      <div>
        <h1 className="text-3xl font-bold text-foreground">My Tasks</h1>
        <p className="text-muted-foreground mt-1">Your assigned tasks - Update status only</p>
      </div>

      {/* Search and Filter */}
      <div className="flex gap-2 flex-wrap">
        <div className="flex-1 min-w-64 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
          <Input
            placeholder="Search your tasks..."
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
      </div>

      {/* Permission Note */}
      <div className="p-3 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded">
        <p className="text-sm text-blue-900 dark:text-blue-200">
          You can only view and update the status of your assigned tasks. Contact your manager to create new tasks.
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Total Tasks</p>
            <p className="text-2xl font-bold">{tasks.filter(t => t.assigneeEmail === currentUserEmail).length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Pending</p>
            <p className="text-2xl font-bold text-amber-600">
              {tasks.filter(t => t.assigneeEmail === currentUserEmail && t.status === 'pending').length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">In Progress</p>
            <p className="text-2xl font-bold text-blue-600">
              {tasks.filter(t => t.assigneeEmail === currentUserEmail && t.status === 'in-progress').length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Completed</p>
            <p className="text-2xl font-bold text-green-600">
              {tasks.filter(t => t.assigneeEmail === currentUserEmail && t.status === 'completed').length}
            </p>
          </CardContent>
        </Card>
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
                  <p className="text-sm text-muted-foreground mt-1">{task.project}</p>
                </div>

                <div className="flex items-center gap-2 flex-wrap justify-end">
                  <Badge variant={getPriorityColor(task.priority) as any}>
                    {task.priority}
                  </Badge>
                  <Badge variant={getStatusColor(task.status) as any}>
                    {task.status}
                  </Badge>
                  <span className="text-sm text-muted-foreground whitespace-nowrap">
                    {new Date(task.dueDate).toLocaleDateString()}
                  </span>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleOpenEdit(task)}
                >
                  <Edit size={16} />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredTasks.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-muted-foreground">No tasks assigned to you</p>
          </CardContent>
        </Card>
      )}

      {/* Update Status Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTask(null);
        }}
        title={editingTask ? `Update: ${editingTask.title}` : 'Update Task'}
        actions={
          <>
            <Button
              variant="outline"
              onClick={() => {
                setIsModalOpen(false);
                setEditingTask(null);
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleUpdateStatus}>
              Update Status
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          {editingTask && (
            <>
              <div className="p-3 bg-muted rounded">
                <p className="text-sm font-medium text-foreground">{editingTask.title}</p>
                <p className="text-sm text-muted-foreground mt-1">{editingTask.project}</p>
              </div>
              <Select
                label="Status"
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                options={[
                  { value: 'pending', label: 'Pending' },
                  { value: 'in-progress', label: 'In Progress' },
                  { value: 'completed', label: 'Completed' },
                ]}
              />
              <div className="p-2 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded text-sm">
                <p className="text-blue-900 dark:text-blue-200">
                  Due: {new Date(editingTask.dueDate).toLocaleDateString()}
                </p>
              </div>
            </>
          )}
        </div>
      </Modal>
    </div>
  );
}
