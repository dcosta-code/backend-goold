export enum ErrorCode {
  INSUFFICIENT_PERMISSIONS = "INSUFFICIENT_PERMISSIONS",
  INSUFFICIENT_ROLE = "INSUFFICIENT_ROLE",
}

export class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;
  public errorCode?: string;

  constructor(message: string, statusCode: number, errorCode?: string) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    this.errorCode = errorCode;

    Error.captureStackTrace(this, this.constructor);
  }

  static badRequest(message: string): AppError {
    return new AppError(message, 400);
  }

  static unauthorized(message: string = "Unauthorized"): AppError {
    return new AppError(message, 401);
  }

  static forbidden(message: string = "Forbidden"): AppError {
    return new AppError(message, 403);
  }

  static notFound(message: string = "Resource not found", errorCode?: string): AppError {
    return new AppError(message, 404, errorCode);
  }

  static conflict(message: string = "Resource already exists"): AppError {
    return new AppError(message, 409);
  }

  static internal(message: string = "Internal server error"): AppError {
    return new AppError(message, 500);
  }

  static insufficientPermissions(
    requiredPermission?: string
  ): AppError {
    const message = requiredPermission
      ? `Insufficient permissions: ${requiredPermission} required`
      : "Insufficient permissions";
    return new AppError(message, 403, ErrorCode.INSUFFICIENT_PERMISSIONS);
  }

  static insufficientRole(requiredRoles?: string[]): AppError {
    const message = requiredRoles?.length
      ? `Insufficient role: one of [${requiredRoles.join(", ")}] required`
      : "Insufficient role";
    return new AppError(message, 403, ErrorCode.INSUFFICIENT_ROLE);
  }
}
