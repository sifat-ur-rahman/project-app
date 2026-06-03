'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { FolderOpen, CheckSquare, TrendingUp } from 'lucide-react';

/**
 * Manager (PM) Dashboard Page
 * 
 * Project-focused overview with limited metrics:
 * - My projects count
 * - My team's tasks overview
 * - Completion rate for my projects
 * - Charts for my projects only
 */

const projectData = [
  { name: 'Q1', projects: 2, completed: 1 },
  { name: 'Q2', projects: 3, completed: 2 },
  { name: 'Q3', projects: 4, completed: 3 },
  { name: 'Q4', projects: 3, completed: 3 },
];

const taskStatusData = [
  { name: 'Completed', value: 20, fill: '#22c55e' },
  { name: 'In Progress', value: 15, fill: '#3b82f6' },
  { name: 'Pending', value: 10, fill: '#f59e0b' },
];

export default function ManagerDashboardPage() {
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    const email = sessionStorage.getItem('userEmail');
    setUserEmail(email || 'pm@company.com');
  }, []);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Project Manager Dashboard</h1>
        <p className="text-muted-foreground">
          Your projects and team overview
        </p>
      </div>

      {/* Stats Cards - PM Specific View */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* My Projects */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">My Projects</CardTitle>
              <FolderOpen size={20} className="text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4</div>
            <p className="text-xs text-muted-foreground mt-1">Currently managing</p>
          </CardContent>
        </Card>

        {/* Team Tasks */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Team Tasks</CardTitle>
              <CheckSquare size={20} className="text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45</div>
            <p className="text-xs text-muted-foreground mt-1">Assigned to team</p>
          </CardContent>
        </Card>

        {/* Completion Rate */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
              <TrendingUp size={20} className="text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">57%</div>
            <Badge variant="success" className="mt-1">On track</Badge>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* My Projects Overview */}
        <Card>
          <CardHeader>
            <CardTitle>My Projects Progress</CardTitle>
            <CardDescription>Your managed projects by quarter</CardDescription>
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

        {/* Team Task Status */}
        <Card>
          <CardHeader>
            <CardTitle>Team Task Status</CardTitle>
            <CardDescription>Your team's tasks breakdown</CardDescription>
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

      {/* Team Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Team Activity</CardTitle>
          <CardDescription>Latest updates from your projects</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { user: 'Sarah Chen', action: 'completed task', item: 'API Integration', time: '2 hours ago' },
              { user: 'John Smith', action: 'updated status', item: 'Database Design', time: '4 hours ago' },
              { user: 'Emily Davis', action: 'commented on task', item: 'UI Implementation', time: '6 hours ago' },
              { user: 'Mike Johnson', action: 'submitted task', item: 'Testing Report', time: '1 day ago' },
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
