"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Settings,
  Users,
  FolderOpen,
  CheckSquare,
  BarChart3,
  LogOut,
  Menu,
  X,
} from "lucide-react";

/**
 * Admin Sidebar Navigation Component
 *
 * Admin users have full access to all features:
 * - Dashboard overview
 * - Projects management (create, edit, delete)
 * - Tasks management (create, edit, delete)
 * - Team member management
 * - Analytics and reports
 * - System settings
 */
export default function AdminSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(true);

  const handleLogout = () => {
    sessionStorage.clear();
    router.push("/auth/login");
  };

  // Navigation items for admin
  const navItems = [
    {
      label: "Dashboard",
      href: "/admin/dashboard",
      icon: LayoutDashboard,
    },
    {
      label: "Projects",
      href: "/admin/projects",
      icon: FolderOpen,
    },
    {
      label: "Tasks",
      href: "/admin/tasks",
      icon: CheckSquare,
    },
    {
      label: "Team",
      href: "/admin/team",
      icon: Users,
    },
    {
      label: "Analytics",
      href: "/admin/analytics",
      icon: BarChart3,
    },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <>
      {/* Mobile toggle button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 hover:bg-muted rounded"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
          transition-transform duration-300
          fixed lg:static
          left-0 top-0
          h-screen
          w-64 bg-card border-r border-border
          flex flex-col
          z-40
        `}
      >
        {/* Logo / Branding */}
        <div className="p-6 border-b border-border">
          <h1 className="text-xl font-bold text-foreground">TaskForge</h1>
          <p className="text-xs text-muted-foreground mt-1">Admin Panel</p>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 p-4 space-y-2 overflow-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  flex items-center gap-3 px-4 py-2 rounded-lg
                  transition-colors duration-200
                  ${
                    active
                      ? "bg-primary text-primary-foreground"
                      : "text-foreground hover:bg-muted"
                  }
                `}
              >
                <Icon size={20} />
                <span className="text-sm font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Info and Logout */}
        <div className="p-4 border-t border-border space-y-2">
          <p className="text-xs text-muted-foreground px-4">Admin Account</p>
          <Button
            variant="destructive"
            size="sm"
            onClick={handleLogout}
            className="w-full flex items-center gap-2"
          >
            <LogOut size={16} />
            Logout
          </Button>
        </div>
      </aside>

      {/* Mobile backdrop */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
        />
      )}
    </>
  );
}
