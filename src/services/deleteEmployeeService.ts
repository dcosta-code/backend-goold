import { employeeRepository } from "../repositories/employeeRepository";
import { AppError } from "../utils/AppError";

interface DeleteEmployeeOptions {
  targetExternalId: string;
  requestingUserExternalId: string;
}

export const deleteEmployeeService = {
  async execute(options: DeleteEmployeeOptions): Promise<void> {
    const { targetExternalId, requestingUserExternalId } = options;

    if (targetExternalId === requestingUserExternalId) {
      throw AppError.forbidden("You cannot delete your own account");
    }

    const employee = await employeeRepository.findByExternalIdWithRoles(targetExternalId);
    if (!employee) {
      throw AppError.notFound("Employee not found");
    }

    await employeeRepository.delete(employee.id);
  },
};
