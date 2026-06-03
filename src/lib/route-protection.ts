/**
 * Route Protection Utility
 * 
 * Handles role-based route protection and redirects
 * Ensures users only access routes for their role
 */

import { UserRole } from './auth';

/**
 * Get the correct dashboard path for a user role
 * 
 * @param role - User's role (admin, pm, member)
 * @returns Dashboard URL path for the role
 */
export function getDashboardPathForRole(role: UserRole): string {
  switch (role) {
    case 'admin':
      return '/admin/dashboard';
    case 'pm':
      return '/manager/dashboard';
    case 'member':
      return '/member/dashboard';
    default:
      return '/auth/login';
  }
}

/**
 * Check if user can access a specific route
 * 
 * @param userRole - User's role
 * @param targetPath - The path user is trying to access
 * @returns true if user can access the path
 */
export function canAccessRoute(userRole: UserRole, targetPath: string): boolean {
  // Extract the role prefix from the path
  const pathRole = targetPath.split('/')[1]; // Gets 'admin', 'manager', or 'member'

  // Map path role to internal role names
  const roleMap: Record<string, UserRole> = {
    admin: 'admin',
    manager: 'pm',
    member: 'member',
  };

  const requiredRole = roleMap[pathRole];

  // If path doesn't match any role, deny access
  if (!requiredRole) {
    return false;
  }

  // Check if user's role matches required role
  return userRole === requiredRole;
}

/**
 * Get all accessible paths for a user role
 * 
 * @param role - User's role
 * @returns Array of accessible route prefixes
 */
export function getAccessiblePaths(role: UserRole): string[] {
  switch (role) {
    case 'admin':
      return ['/admin', '/auth'];
    case 'pm':
      return ['/manager', '/auth'];
    case 'member':
      return ['/member', '/auth'];
    default:
      return ['/auth'];
  }
}
