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
import { Select } from "@/components/ui/select";
import { Plus, Search, Edit, Trash2, Users, AlertCircle } from "lucide-react";
import {
  getAllTeamMembers,
  createTeamMember,
  updateTeamMember,
  deleteTeamMember,
} from "@/server/actions/team";
import { getAllTasks } from "@/server/actions/tasks";

/**
 * Admin Team Management Page
 *
 * Full team management with real database integration:
 * - Add new team members to MongoDB
 * - Edit member details
 * - Delete members
 * - Assign roles
 * - View all members from database
 */

export default function AdminTeamPage() {
  const [members, setMembers] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "member",
    department: "",
    password: "",
    status: "active",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [membersResult, tasksResult] = await Promise.all([
        getAllTeamMembers(),
        getAllTasks(),
      ]);

      if (membersResult.success) {
        setMembers(membersResult.members || []);
      }
      if (tasksResult.success) {
        setTasks(tasksResult.tasks || []);
      }
    } catch (err) {
      console.error(" Error fetching team data:", err);
      setError("Failed to load team members");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddMember = async () => {
    if (!formData.name.trim() || !formData.email.trim()) return;

    setIsLoading(true);
    try {
      if (editingId) {
        const result = await updateTeamMember(editingId, {
          name: formData.name,
          status: formData.status,
          role: formData.role,
          department: formData.department,
        });

        if (result.success) {
          await fetchData();
          setEditingId(null);
        }
      } else {
        const result = await createTeamMember({
          name: formData.name,
          email: formData.email,
          role: formData.role,
          department: formData.department,
          password: formData.password,
        });

        if (result.success) {
          await fetchData();
        }
      }

      setFormData({
        name: "",
        email: "",
        role: "member",
        department: "",
        password: "",
        status: "active",
      });
      setIsModalOpen(false);
    } catch (err) {
      console.error(" Error saving member:", err);
      setError("Failed to save team member");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenEdit = (member: any) => {
    setEditingId(member._id || member.id);
    setFormData({
      name: member.name,
      email: member.email,
      role: member.role,
      department: member.department || "",
      password: "",
      status: member.status,
    });
    setIsModalOpen(true);
  };

  const handleDeleteMember = async (id: string) => {
    setIsLoading(true);
    try {
      const result = await deleteTeamMember(id);
      if (result.success) {
        await fetchData();
      }
    } catch (err) {
      console.error(" Error deleting member:", err);
      setError("Failed to delete team member");
    } finally {
      setIsLoading(false);
      setDeleteConfirm(null);
    }
  };

  const filteredMembers = members.filter(
    (m) =>
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.role.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "destructive";
      case "pm":
        return "default";
      case "member":
        return "secondary";
      default:
        return "default";
    }
  };

  const getProjectCountForMember = (memberEmail: string) => {
    return tasks.filter((t) => t.assignee?.email === memberEmail).length;
  };

  if (isLoading && members.length === 0) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Team Management
            </h1>
            <p className="text-muted-foreground mt-1">
              Loading team members...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Team Management
          </h1>
          <p className="text-muted-foreground mt-1">
            {members.length} members from database
          </p>
        </div>
        <Button
          onClick={() => {
            setEditingId(null);
            setFormData({
              name: "",
              email: "",
              role: "member",
              department: "",
              password: "",
              status: "active",
            });
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2"
          disabled={isLoading}
        >
          <Plus size={20} />
          Add Member
        </Button>
      </div>

      {/* Error State */}
      {error && (
        <Card className="border-destructive bg-destructive/10">
          <CardContent className="pt-6 flex gap-3">
            <AlertCircle className="text-destructive flex-shrink-0" />
            <div>
              <p className="font-medium text-destructive">Error</p>
              <p className="text-sm text-muted-foreground">{error}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Members</p>
                <p className="text-2xl font-bold">{members.length}</p>
              </div>
              <Users className="text-primary" size={32} />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Admins</p>
            <p className="text-2xl font-bold">
              {members.filter((m) => m.role === "admin").length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Project Managers</p>
            <p className="text-2xl font-bold">
              {members.filter((m) => m.role === "pm").length}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search Bar */}
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
            size={20}
          />
          <Input
            placeholder="Search members by name, email, or role..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
            disabled={isLoading}
          />
        </div>
      </div>

      {/* Members Table */}
      {filteredMembers.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-muted-foreground">
              {members.length === 0
                ? "No team members in database"
                : "No team members matching search"}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-muted border-b border-border">
              <tr>
                <th className="text-left p-4 font-medium">Name</th>
                <th className="text-left p-4 font-medium">Email</th>
                <th className="text-left p-4 font-medium">Role</th>
                <th className="text-left p-4 font-medium">Tasks Assigned</th>
                <th className="text-left p-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredMembers.map((member) => (
                <tr key={member._id || member.id} className="hover:bg-muted/50">
                  <td className="p-4 font-medium">{member.name}</td>
                  <td className="p-4 text-sm text-muted-foreground">
                    {member.email}
                  </td>
                  <td className="p-4">
                    <Badge variant={getRoleColor(member.role) as any}>
                      {member.role}
                    </Badge>
                  </td>
                  <td className="p-4 text-sm">
                    {getProjectCountForMember(member.email)}
                  </td>
                  <td className="p-4">
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleOpenEdit(member)}
                        disabled={isLoading}
                      >
                        <Edit size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          setDeleteConfirm(member._id || member.id)
                        }
                        disabled={isLoading}
                      >
                        <Trash2 size={16} className="text-destructive" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingId(null);
          setFormData({
            name: "",
            email: "",
            role: "member",
            department: "",
            password: "",
            status: "",
          });
        }}
        title={editingId ? "Edit Member" : "Add New Member"}
        actions={
          <>
            <Button
              variant="outline"
              onClick={() => {
                setIsModalOpen(false);
                setEditingId(null);
                setFormData({
                  name: "",
                  email: "",
                  role: "member",
                  department: "",
                  password: "",
                  status: "",
                });
              }}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddMember}
              disabled={
                isLoading || !formData.name.trim() || !formData.email.trim()
              }
            >
              {editingId ? "Update" : "Add"}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input
            label="Full Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Enter member name"
            disabled={isLoading}
          />
          <Input
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            placeholder="Enter email address"
            disabled={isLoading}
          />
          <div className="flex gap-4">
            <Select
              label="Role"
              value={formData.role}
              onChange={(e) =>
                setFormData({ ...formData, role: e.target.value })
              }
              options={[
                { value: "member", label: "Team Member" },
                { value: "pm", label: "Project Manager" },
                { value: "admin", label: "Administrator" },
              ]}
              disabled={isLoading}
            />
            <Select
              label="Status"
              value={formData.status}
              onChange={(e) =>
                setFormData({ ...formData, status: e.target.value })
              }
              options={[
                { value: "active", label: "Active" },
                { value: "inactive", label: "Inactive" },
              ]}
              disabled={isLoading}
            />
          </div>
          <Input
            label="Department"
            value={formData.department || ""}
            onChange={(e) =>
              setFormData({ ...formData, department: e.target.value })
            }
            placeholder="Enter department (optional)"
            disabled={isLoading}
          />
          {!editingId && (
            <Input
              label="Password"
              type="password"
              value={formData.password || ""}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              placeholder="Set a password for the new member"
              disabled={isLoading}
            />
          )}
        </div>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={deleteConfirm !== null}
        title="Delete Member"
        message="Are you sure you want to remove this team member? They will lose access to all projects."
        confirmText="Delete"
        isDangerous={true}
        onConfirm={() => deleteConfirm && handleDeleteMember(deleteConfirm)}
        onCancel={() => setDeleteConfirm(null)}
      />
    </div>
  );
}
