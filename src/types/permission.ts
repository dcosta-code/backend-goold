export const Permissions = {
  EMPLOYEES_CREATE: "employees.create",
  EMPLOYEES_READ: "employees.read",
  EMPLOYEES_UPDATE: "employees.update",
  EMPLOYEES_DELETE: "employees.delete",
  EMPLOYEES_MANAGER: "employees.manager",
  SUPPORT_DASHBOARD: "support.dashboard",
  SUPPORT_TICKETS: "support.tickets",
  CONFIGURATIONS_MANAGER: "configurations.manager",
} as const;

export type PermissionKey = (typeof Permissions)[keyof typeof Permissions];

export interface CreatePermissionDTO {
  key: string;
  description?: string;
}

export interface PermissionResponse {
  key: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
}
