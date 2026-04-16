"use client";

import { useUser } from "@/hooks/useUser";

/**
 * Define permissions configuration.
 *
 * This object maps resources to roles and the actions they can perform.
 *
 * Structure:
 * {
 *   [resource]: {
 *     [action]: [allowed_roles]
 *   }
 * }
 */
export const PERMISSIONS: Record<string, Record<string, string>> = {
  dashboard: {
    view: "view_dashboard",
  },
  jobs: {
    view: "view_jobs",
    manage: "manage_jobs",
  },
  applications: {
    view: "view_applications",
    submit: "submit_applications",
    manage: "manage_applications",
  },
  users: {
    manage: "manage_users",
  },
  reports: {
    view: "view_reports",
    export: "export_reports",
  },
  leads: {
    view: "view_leads",
    manage: "manage_leads",
  },
  tasks: {
    view: "view_tasks",
    manage: "manage_tasks",
  },
  settings: {
    manage: "manage_settings",
  },
  audit: {
    view: "view_audit_logs",
  },
  customer: {
    view_portal: "view_customer_portal",
  },
};

export type Resource = keyof typeof PERMISSIONS;
export type Action<T extends Resource> = keyof (typeof PERMISSIONS)[T];

export function usePermission() {
  const { hasPermission } = useUser();

  /**
   * Check if the current user has permission to perform an action on a resource.
   *
   * @param resource - The resource being accessed (e.g., "member", "billing")
   * @param action - The action being performed (e.g., "create", "view")
   * @returns true if authorized, false otherwise
   */
  const can = (resource: string, action: string): boolean => {
    const resourcePermissions = PERMISSIONS[resource as Resource] as Record<string, string> | undefined;
    if (!resourcePermissions) return false;

    const atom = resourcePermissions[action];
    if (!atom) return false;

    return hasPermission(atom);
  };

  return { can };
}
