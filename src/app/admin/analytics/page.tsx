'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

/**
 * Admin Analytics Page
 * 
 * Full system analytics with all metrics:
 * - Project completion trends
 * - Team productivity
 * - Task distribution
 * - System-wide metrics
 */

const projectTrendData = [
  { month: 'Jan', completed: 5, pending: 3 },
  { month: 'Feb', completed: 8, pending: 4 },
  { month: 'Mar', completed: 12, pending: 5 },
  { month: 'Apr', completed: 15, pending: 6 },
  { month: 'May', completed: 18, pending: 7 },
  { month: 'Jun', completed: 22, pending: 8 },
];

const teamProductivityData = [
  { week: 'W1', tasks: 45 },
  { week: 'W2', tasks: 52 },
  { week: 'W3', tasks: 48 },
  { week: 'W4', tasks: 61 },
];

export default function AdminAnalyticsPage() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Analytics</h1>
        <p className="text-muted-foreground mt-1">System-wide metrics and insights</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">47</div>
            <p className="text-xs text-muted-foreground mt-1">+5 this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">22</div>
            <p className="text-xs text-green-600 mt-1">47% completion rate</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">156</div>
            <p className="text-xs text-muted-foreground mt-1">+12 this week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Team Members</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground mt-1">100% active</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Project Completion Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Project Completion Trend</CardTitle>
            <CardDescription>Monthly project completion</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={projectTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="month" stroke="var(--color-muted-foreground)" />
                <YAxis stroke="var(--color-muted-foreground)" />
                <Tooltip />
                <Bar dataKey="completed" fill="var(--color-primary)" />
                <Bar dataKey="pending" fill="var(--color-muted)" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Team Productivity */}
        <Card>
          <CardHeader>
            <CardTitle>Team Productivity</CardTitle>
            <CardDescription>Tasks completed per week</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={teamProductivityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="week" stroke="var(--color-muted-foreground)" />
                <YAxis stroke="var(--color-muted-foreground)" />
                <Tooltip />
                <Line type="monotone" dataKey="tasks" stroke="var(--color-primary)" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Projects */}
        <Card>
          <CardHeader>
            <CardTitle>Top Projects</CardTitle>
            <CardDescription>By completion rate</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { name: 'Website Redesign', progress: 85 },
                { name: 'Mobile App', progress: 60 },
                { name: 'API Integration', progress: 45 },
                { name: 'Database Migration', progress: 100 },
              ].map((project, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium">{project.name}</p>
                    <p className="text-sm text-muted-foreground">{project.progress}%</p>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full"
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Team Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Team Performance</CardTitle>
            <CardDescription>Tasks completed per member</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { name: 'Sarah Chen', tasks: 18 },
                { name: 'John Smith', tasks: 16 },
                { name: 'Emily Davis', tasks: 14 },
                { name: 'Mike Johnson', tasks: 12 },
              ].map((member, index) => (
                <div key={index} className="flex items-center justify-between">
                  <p className="text-sm font-medium">{member.name}</p>
                  <div className="flex items-center gap-2">
                    <div className="text-sm text-muted-foreground">{member.tasks} tasks</div>
                    <div className="w-24 bg-muted rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full"
                        style={{ width: `${(member.tasks / 20) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
