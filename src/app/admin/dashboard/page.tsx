'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Users, FolderOpen, CheckSquare, TrendingUp } from 'lucide-react';

/**
 * Admin Dashboard Page
 * 
 * Full system overview with all metrics:
 * - Total projects count
 * - All tasks overview
 * - Team members count
 * - Overall completion rate
 * - Detailed charts and analytics
 */

const projectData = [
  { name: 'Q1', projects: 5, completed: 3 },
  { name: 'Q2', projects: 8, completed: 6 },
  { name: 'Q3', projects: 12, completed: 9 },
  { name: 'Q4', projects: 15, completed: 12 },
];

const taskStatusData = [
  { name: 'Completed', value: 45, fill: '#22c55e' },
  { name: 'In Progress', value: 30, fill: '#3b82f6' },
  { name: 'Pending', value: 25, fill: '#f59e0b' },
];

export default function AdminDashboardPage() {
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    const email = sessionStorage.getItem('userEmail');
    setUserEmail(email || 'admin@company.com');
  }, []);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Full system overview and management
        </p>
      </div>

      {/* Stats Cards - Full System View */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Projects */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
              <FolderOpen size={20} className="text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground mt-1">+2 from last month</p>
          </CardContent>
        </Card>

        {/* All Tasks */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">All Tasks</CardTitle>
              <CheckSquare size={20} className="text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">100</div>
            <p className="text-xs text-muted-foreground mt-1">Across all projects</p>
          </CardContent>
        </Card>

        {/* Team Members */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Team Members</CardTitle>
              <Users size={20} className="text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground mt-1">All active</p>
          </CardContent>
        </Card>

        {/* Overall Rate */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
              <TrendingUp size={20} className="text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">60%</div>
            <Badge variant="success" className="mt-1">On track</Badge>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Projects Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Projects Overview</CardTitle>
            <CardDescription>Quarterly project statistics</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={projectData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="name" stroke="var(--color-muted-foreground)" />
                <YAxis stroke="var(--color-muted-foreground)" />
                <Tooltip />
                <Bar dataKey="projects" fill="var(--color-primary)" />
                <Bar dataKey="completed" fill="var(--color-accent)" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Task Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Task Status Distribution</CardTitle>
            <CardDescription>Current task breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={taskStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {taskStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* System Activity */}
      <Card>
        <CardHeader>
          <CardTitle>System Activity</CardTitle>
          <CardDescription>Latest updates across all teams</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { user: 'Sarah Chen', action: 'completed task', item: 'API Integration', time: '2 hours ago' },
              { user: 'John Smith', action: 'created project', item: 'Mobile App Redesign', time: '4 hours ago' },
              { user: 'Emily Davis', action: 'updated status', item: 'Dashboard Backend', time: '6 hours ago' },
              { user: 'Mike Johnson', action: 'assigned task', item: 'Database Migration', time: '1 day ago' },
              { user: 'Alex Taylor', action: 'added team member', item: 'New Developer', time: '2 days ago' },
            ].map((activity, index) => (
              <div key={index} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <div>
                  <p className="text-sm font-medium text-foreground">
                    <span className="text-muted-foreground">{activity.user}</span>
                    {' '}{activity.action}{' '}
                    <span className="font-medium">{activity.item}</span>
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
