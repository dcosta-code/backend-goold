export const Roles = {
  ADMIN: "admin",
  SUPPORT: "support",
} as const;

export type RoleName = (typeof Roles)[keyof typeof Roles];

export interface CreateRoleDTO {
  name: string;
  description?: string;
}

export interface RoleResponse {
  externalId: string;
  name: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
}
