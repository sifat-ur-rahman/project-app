/**
 * RoleRedirect Component
 * 
 * Redirects users to their role-appropriate dashboard on login
 * Used to handle initial login redirect based on user role
 */

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getUserRole } from '@/lib/auth';
import { getDashboardPathForRole } from '@/lib/route-protection';

export function RoleRedirect() {
  const router = useRouter();

  useEffect(() => {
    // Get current user's role
    const userRole = getUserRole();

    // Get the appropriate dashboard path for this role
    const dashboardPath = getDashboardPathForRole(userRole);

    // Redirect to role-specific dashboard
    router.push(dashboardPath);
  }, [router]);

  // Show loading while redirecting
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <p className="text-muted-foreground">Redirecting to your dashboard...</p>
      </div>
    </div>
  );
}
