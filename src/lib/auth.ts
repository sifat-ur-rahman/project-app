export type UserRole = 'admin' | 'pm' | 'member';

export interface RolePermission {
  canCreateProject: boolean;
  canEditProject: boolean;
  canDeleteProject: boolean;
  canCreateTask: boolean;
  canEditTask: boolean;
  canDeleteTask: boolean;
  canManageTeam: boolean;
  canViewAnalytics: boolean;
  canAssignTasks: boolean;
}

export const rolePermissions: Record<UserRole, RolePermission> = {
  admin: {
    canCreateProject: true,
    canEditProject: true,
    canDeleteProject: true,
    canCreateTask: true,
    canEditTask: true,
    canDeleteTask: true,
    canManageTeam: true,
    canViewAnalytics: true,
    canAssignTasks: true,
  },
  pm: {
    canCreateProject: true,
    canEditProject: true,
    canDeleteProject: false,
    canCreateTask: true,
    canEditTask: true,
    canDeleteTask: false,
    canManageTeam: false,
    canViewAnalytics: true,
    canAssignTasks: true,
  },
  member: {
    canCreateProject: false,
    canEditProject: false,
    canDeleteProject: false,
    canCreateTask: false,
    canEditTask: true,
    canDeleteTask: false,
    canManageTeam: false,
    canViewAnalytics: false,
    canAssignTasks: false,
  },
};

export function getUserRole(): UserRole {
  if (typeof window === 'undefined') return 'member';
  const role = sessionStorage.getItem('userRole') as UserRole;
  return role || 'member';
}

export function getCurrentUserEmail(): string {
  if (typeof window === 'undefined') return '';
  return sessionStorage.getItem('userEmail') || '';
}

export function hasPermission(role: UserRole, permission: keyof RolePermission): boolean {
  return rolePermissions[role][permission];
}

export function canUserEditProject(role: UserRole, projectOwnerId: string): boolean {
  const currentUser = getCurrentUserEmail();
  if (role === 'admin') return true;
  if (role === 'pm' && currentUser === projectOwnerId) return true;
  return false;
}

export function canUserDeleteProject(role: UserRole, projectOwnerId: string): boolean {
  const currentUser = getCurrentUserEmail();
  if (role === 'admin') return true;
  return false;
}

export function canUserEditTask(role: UserRole, assigneeEmail: string): boolean {
  const currentUser = getCurrentUserEmail();
  if (role === 'admin') return true;
  if (role === 'pm') return true;
  if (role === 'member' && currentUser === assigneeEmail) return true;
  return false;
}

export function canUserDeleteTask(role: UserRole): boolean {
  return role === 'admin';
}
