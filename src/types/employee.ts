export interface CreateEmployeeDTO {
  email: string;
  password: string;
  fullName: string;
  roles: string[];
  permissions?: string[];
}

export interface UpdateEmployeeDTO {
  email?: string;
  password?: string;
  fullName?: string;
  isActive?: boolean;
  roles?: string[];
  permissions?: string[];
}

export interface ListEmployeesQueryDTO {
  search?: string;
}

export interface EmployeeResponse {
  externalId: string;
  email: string;
  fullName: string;
  isActive: boolean;
  roles: string[];
  permissions: string[];
  createdAt: Date;
  updatedAt: Date;
}
