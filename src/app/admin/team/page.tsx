"use client";

import { useState } from "react";
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
import { Plus, Search, Edit, Trash2, Users } from "lucide-react";

/**
 * Admin Team Management Page
 *
 * Full team management with all permissions:
 * - Add new team members
 * - Edit member details
 * - Delete members
 * - Assign roles
 * - View all members
 */

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: "admin" | "pm" | "member";
  status: "active" | "inactive";
  joinDate: string;
  projects: number;
}

const initialMembers: TeamMember[] = [
  {
    id: "1",
    name: "Sarah Chen",
    email: "sarah@company.com",
    role: "member",
    status: "active",
    joinDate: "2024-01-15",
    projects: 3,
  },
  {
    id: "2",
    name: "John Smith",
    email: "john@company.com",
    role: "pm",
    status: "active",
    joinDate: "2023-06-20",
    projects: 2,
  },
  {
    id: "3",
    name: "Emily Davis",
    email: "emily@company.com",
    role: "member",
    status: "active",
    joinDate: "2024-03-10",
    projects: 4,
  },
];

export default function AdminTeamPage() {
  const [members, setMembers] = useState(initialMembers);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "member" as const,
  });

  const handleAddMember = () => {
    if (formData.name.trim() && formData.email.trim()) {
      if (editingId) {
        setMembers(
          members.map((m) => (m.id === editingId ? { ...m, ...formData } : m)),
        );
        setEditingId(null);
      } else {
        const newMember: TeamMember = {
          id: Date.now().toString(),
          name: formData.name,
          email: formData.email,
          role: formData.role,
          status: "active",
          joinDate: new Date().toISOString().split("T")[0],
          projects: 0,
        };
        setMembers([newMember, ...members]);
      }
      setFormData({ name: "", email: "", role: "member" });
      setIsModalOpen(false);
    }
  };

  const handleOpenEdit = (member: TeamMember) => {
    setEditingId(member.id);
    setFormData({
      name: member.name,
      email: member.email,
      role:
        member.role === "admin" || member.role === "pm"
          ? "member"
          : member.role,
    });
    setIsModalOpen(true);
  };

  const handleDeleteMember = (id: string) => {
    setMembers(members.filter((m) => m.id !== id));
    setDeleteConfirm(null);
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

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Team Management
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage all team members and their roles
          </p>
        </div>
        <Button
          onClick={() => {
            setEditingId(null);
            setFormData({ name: "", email: "", role: "member" });
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2"
        >
          <Plus size={20} />
          Add Member
        </Button>
      </div>

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
            <p className="text-sm text-muted-foreground">Active Now</p>
            <p className="text-2xl font-bold">
              {members.filter((m) => m.status === "active").length}
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
            placeholder="Search members..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Members Table */}
      <div className="border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-muted border-b border-border">
            <tr>
              <th className="text-left p-4 font-medium">Name</th>
              <th className="text-left p-4 font-medium">Email</th>
              <th className="text-left p-4 font-medium">Role</th>
              <th className="text-left p-4 font-medium">Status</th>
              <th className="text-left p-4 font-medium">Projects</th>
              <th className="text-left p-4 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filteredMembers.map((member) => (
              <tr key={member.id} className="hover:bg-muted/50">
                <td className="p-4 font-medium">{member.name}</td>
                <td className="p-4 text-sm text-muted-foreground">
                  {member.email}
                </td>
                <td className="p-4">
                  <Badge variant={getRoleColor(member.role) as any}>
                    {member.role}
                  </Badge>
                </td>
                <td className="p-4">
                  <Badge
                    variant={
                      member.status === "active" ? "success" : "secondary"
                    }
                  >
                    {member.status}
                  </Badge>
                </td>
                <td className="p-4 text-sm">{member.projects}</td>
                <td className="p-4">
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleOpenEdit(member)}
                    >
                      <Edit size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setDeleteConfirm(member.id)}
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

      {/* Empty State */}
      {filteredMembers.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-muted-foreground">No team members found</p>
          </CardContent>
        </Card>
      )}

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingId(null);
          setFormData({ name: "", email: "", role: "member" });
        }}
        title={editingId ? "Edit Member" : "Add New Member"}
        actions={
          <>
            <Button
              variant="outline"
              onClick={() => {
                setIsModalOpen(false);
                setEditingId(null);
                setFormData({ name: "", email: "", role: "member" });
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleAddMember}>
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
          />
          <Input
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            placeholder="Enter email address"
          />
          <Select
            label="Role"
            value={formData.role}
            onChange={(e) =>
              setFormData({ ...formData, role: e.target.value as any })
            }
            options={[
              { value: "member", label: "Team Member" },
              { value: "pm", label: "Project Manager" },
              { value: "admin", label: "Administrator" },
            ]}
          />
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
