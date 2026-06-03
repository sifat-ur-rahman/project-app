'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Settings, Database, Lock, Bell } from 'lucide-react';

/**
 * Admin Settings Page
 * 
 * System configuration for administrators:
 * - Application settings
 * - User management
 * - System preferences
 * - Security settings
 */

export default function AdminSettingsPage() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">System Settings</h1>
        <p className="text-muted-foreground mt-1">Configure system-wide settings and preferences</p>
      </div>

      {/* General Settings */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Settings className="text-primary" size={24} />
            <div>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>Application configuration</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-border rounded">
            <div>
              <p className="font-medium">Application Name</p>
              <p className="text-sm text-muted-foreground">Project Manager</p>
            </div>
            <Button variant="outline" size="sm">Edit</Button>
          </div>
          <div className="flex items-center justify-between p-4 border border-border rounded">
            <div>
              <p className="font-medium">System Version</p>
              <p className="text-sm text-muted-foreground">v1.0.0</p>
            </div>
            <Badge>Latest</Badge>
          </div>
          <div className="flex items-center justify-between p-4 border border-border rounded">
            <div>
              <p className="font-medium">Maintenance Mode</p>
              <p className="text-sm text-muted-foreground">Currently disabled</p>
            </div>
            <Button variant="outline" size="sm">Enable</Button>
          </div>
        </CardContent>
      </Card>

      {/* Database Settings */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Database className="text-primary" size={24} />
            <div>
              <CardTitle>Database</CardTitle>
              <CardDescription>Data storage configuration</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-border rounded">
            <div>
              <p className="font-medium">Database Type</p>
              <p className="text-sm text-muted-foreground">PostgreSQL</p>
            </div>
            <Badge variant="success">Connected</Badge>
          </div>
          <div className="flex items-center justify-between p-4 border border-border rounded">
            <div>
              <p className="font-medium">Backup Status</p>
              <p className="text-sm text-muted-foreground">Last backup: 2 hours ago</p>
            </div>
            <Button variant="outline" size="sm">Backup Now</Button>
          </div>
          <div className="flex items-center justify-between p-4 border border-border rounded">
            <div>
              <p className="font-medium">Database Size</p>
              <p className="text-sm text-muted-foreground">245 MB</p>
            </div>
            <Badge variant="outline">Normal</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Lock className="text-primary" size={24} />
            <div>
              <CardTitle>Security</CardTitle>
              <CardDescription>System security configuration</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-border rounded">
            <div>
              <p className="font-medium">SSL Certificate</p>
              <p className="text-sm text-muted-foreground">Encrypted connections</p>
            </div>
            <Badge variant="success">Active</Badge>
          </div>
          <div className="flex items-center justify-between p-4 border border-border rounded">
            <div>
              <p className="font-medium">Session Timeout</p>
              <p className="text-sm text-muted-foreground">30 minutes</p>
            </div>
            <Button variant="outline" size="sm">Configure</Button>
          </div>
          <div className="flex items-center justify-between p-4 border border-border rounded">
            <div>
              <p className="font-medium">Two-Factor Auth</p>
              <p className="text-sm text-muted-foreground">Currently disabled</p>
            </div>
            <Button variant="outline" size="sm">Enable</Button>
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Bell className="text-primary" size={24} />
            <div>
              <CardTitle>Notifications</CardTitle>
              <CardDescription>System alerts and notifications</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-border rounded">
            <div>
              <p className="font-medium">Email Notifications</p>
              <p className="text-sm text-muted-foreground">Send alerts to admin</p>
            </div>
            <Button variant="outline" size="sm">Enabled</Button>
          </div>
          <div className="flex items-center justify-between p-4 border border-border rounded">
            <div>
              <p className="font-medium">System Alerts</p>
              <p className="text-sm text-muted-foreground">Errors and warnings</p>
            </div>
            <Button variant="outline" size="sm">Configure</Button>
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-destructive/50">
        <CardHeader>
          <CardTitle className="text-destructive">Danger Zone</CardTitle>
          <CardDescription>Irreversible actions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button variant="outline" className="w-full text-destructive hover:text-destructive">
            Clear All Cache
          </Button>
          <Button variant="outline" className="w-full text-destructive hover:text-destructive">
            Reset System
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
