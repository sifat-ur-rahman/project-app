import { UserRole } from "./auth";

export function getDashboardPathForRole(role: UserRole): string {
  switch (role) {
    case "admin":
      return "/admin/dashboard";
    case "pm":
      return "/manager/dashboard";
    case "member":
      return "/member/dashboard";
    default:
      return "/auth/login";
  }
}

export function canAccessRoute(
  userRole: UserRole,
  targetPath: string,
): boolean {
  // Extract the role prefix from the path
  const pathRole = targetPath.split("/")[1]; // Gets 'admin', 'manager', or 'member'

  // Map path role to internal role names
  const roleMap: Record<string, UserRole> = {
    admin: "admin",
    manager: "pm",
    member: "member",
  };

  const requiredRole = roleMap[pathRole];

  // If path doesn't match any role, deny access
  if (!requiredRole) {
    return false;
  }

  // Check if user's role matches required role
  return userRole === requiredRole;
}

export function getAccessiblePaths(role: UserRole): string[] {
  switch (role) {
    case "admin":
      return ["/admin", "/auth"];
    case "pm":
      return ["/manager", "/auth"];
    case "member":
      return ["/member", "/auth"];
    default:
      return ["/auth"];
  }
}
