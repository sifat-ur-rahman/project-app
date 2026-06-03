'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getUserRole } from '@/lib/auth';
import AdminSidebar from '@/components/admin/sidebar';

/**
 * Admin Dashboard Layout
 * 
 * Protected layout for admin users only
 * Shows admin-specific sidebar navigation
 * Full system access and management capabilities
 */
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  // Verify user is admin on mount
  useEffect(() => {
    const userRole = getUserRole();
    if (userRole !== 'admin') {
      // Redirect non-admin users
      router.push('/auth/login');
    }
  }, [router]);

  return (
    <div className="flex h-screen bg-background">
      {/* Admin Sidebar Navigation */}
      <AdminSidebar />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
