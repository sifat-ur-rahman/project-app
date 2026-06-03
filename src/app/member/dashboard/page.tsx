'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { CheckSquare, Clock, AlertCircle } from 'lucide-react';

/**
 * Member Dashboard Page
 * 
 * Personal task-focused overview:
 * - My assigned tasks count
 * - Tasks due this week
 * - Completion rate for my tasks
 * - My task status breakdown
 */

const myTasksData = [
  { name: 'Completed', value: 12, fill: '#22c55e' },
  { name: 'In Progress', value: 8, fill: '#3b82f6' },
  { name: 'Pending', value: 5, fill: '#f59e0b' },
];

export default function MemberDashboardPage() {
  const [userEmail, setUserEmail] = useState('');
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const email = sessionStorage.getItem('userEmail');
    const name = email ? email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1) : 'Team Member';
    setUserEmail(email || 'member@company.com');
    setUserName(name);
  }, []);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Welcome, {userName}</h1>
        <p className="text-muted-foreground">
          Here&apos;s your task overview for today
        </p>
      </div>

      {/* Stats Cards - Member Specific View */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* My Assigned Tasks */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">My Tasks</CardTitle>
              <CheckSquare size={20} className="text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">25</div>
            <p className="text-xs text-muted-foreground mt-1">Total assigned to you</p>
          </CardContent>
        </Card>

        {/* Due This Week */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Due This Week</CardTitle>
              <Clock size={20} className="text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground mt-1">Deadline approaching</p>
          </CardContent>
        </Card>

        {/* My Completion Rate */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">My Completion</CardTitle>
              <AlertCircle size={20} className="text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">48%</div>
            <Badge variant="warning" className="mt-1">48 of 25 completed</Badge>
          </CardContent>
        </Card>
      </div>

      {/* My Tasks Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Task Status Chart */}
        <Card>
          <CardHeader>
            <CardTitle>My Task Status</CardTitle>
            <CardDescription>Your task breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={myTasksData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {myTasksData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Upcoming Tasks */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Tasks</CardTitle>
            <CardDescription>Tasks due soon</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { task: 'API Integration', project: 'Mobile App', due: 'Tomorrow' },
                { task: 'Code Review', project: 'Dashboard', due: '2 days' },
                { task: 'Unit Tests', project: 'Backend', due: '3 days' },
                { task: 'Documentation', project: 'API Docs', due: '4 days' },
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <div>
                    <p className="text-sm font-medium text-foreground">{item.task}</p>
                    <p className="text-xs text-muted-foreground">{item.project}</p>
                  </div>
                  <Badge variant="outline">{item.due}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Info */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Info</CardTitle>
          <CardDescription>Important reminders</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="p-3 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded">
              <p className="text-sm font-medium text-blue-900 dark:text-blue-200">
                You can only view and edit your assigned tasks
              </p>
            </div>
            <div className="p-3 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded">
              <p className="text-sm font-medium text-green-900 dark:text-green-200">
                Update your task status regularly to keep the team informed
              </p>
            </div>
            <div className="p-3 bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded">
              <p className="text-sm font-medium text-amber-900 dark:text-amber-200">
                Ask your manager if you need help or have questions
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
