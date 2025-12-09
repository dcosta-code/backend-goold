import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/AppError";
import { employeeRepository } from "../repositories/employeeRepository";
import { RoleName } from "../types/role";
import { PermissionKey } from "../types/permission";

export const requireRoles = (...allowedRoles: RoleName[]) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user || req.user.userType !== "employee") {
      next(AppError.forbidden("Access denied"));
      return;
    }

    const userRoles = req.user.roles || [];
    const hasRole = allowedRoles.some((role) => userRoles.includes(role));

    if (!hasRole) {
      next(AppError.insufficientRole(allowedRoles));
      return;
    }

    next();
  };
};

export const requirePermission = (permissionKey: PermissionKey) => {
  return async (
    req: Request,
    _res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      if (!req.user || req.user.userType !== "employee") {
        next(AppError.forbidden("Access denied"));
        return;
      }

      const employee =
        await employeeRepository.findByExternalIdWithRolesAndPermissions(
          req.user.externalId
        );

      if (!employee) {
        next(AppError.insufficientPermissions(permissionKey));
        return;
      }

      const permissions = employee.permissions || [];
      const hasPermission = permissions.some((p) => p.key === permissionKey);

      if (!hasPermission) {
        next(AppError.insufficientPermissions(permissionKey));
        return;
      }

      next();
    } catch (error) {
      next(AppError.insufficientPermissions(permissionKey));
    }
  };
};
