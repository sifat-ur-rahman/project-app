'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard, 
  FolderOpen, 
  CheckSquare, 
  BarChart3,
  LogOut,
  Menu,
  X
} from 'lucide-react';

/**
 * Manager (PM) Sidebar Navigation Component
 * 
 * PM users have limited management access:
 * - Dashboard overview
 * - Projects management (create, edit only - no delete)
 * - Tasks management (create, edit only - no delete)
 * - Analytics and reports
 * - NO team management or system settings
 */
export default function ManagerSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(true);

  const handleLogout = () => {
    sessionStorage.clear();
    router.push('/auth/login');
  };

  // Navigation items for PM (limited compared to admin)
  const navItems = [
    {
      label: 'Dashboard',
      href: '/manager/dashboard',
      icon: LayoutDashboard,
    },
    {
      label: 'Projects',
      href: '/manager/projects',
      icon: FolderOpen,
    },
    {
      label: 'Tasks',
      href: '/manager/tasks',
      icon: CheckSquare,
    },
    {
      label: 'Reports',
      href: '/manager/reports',
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
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
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
          <h1 className="text-xl font-bold text-foreground">Project Manager</h1>
          <p className="text-xs text-muted-foreground mt-1">Project Manager Panel</p>
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
                      ? 'bg-primary text-primary-foreground'
                      : 'text-foreground hover:bg-muted'
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
          <p className="text-xs text-muted-foreground px-4">Project Manager</p>
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
