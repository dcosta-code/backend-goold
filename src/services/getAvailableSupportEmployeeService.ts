import { employeeRepository } from "../repositories/employeeRepository";
import { ticketRepository } from "../repositories/ticketRepository";
import { Employee } from "../models/Employee";
import { Roles } from "../types/role";
import { AppError } from "../utils/AppError";

export const getAvailableSupportEmployeeService = {
  async execute(): Promise<Employee> {
    const supportEmployees = await employeeRepository.findActiveByRoleName(
      Roles.SUPPORT
    );

    if (supportEmployees.length === 0) {
      throw AppError.badRequest("No support employees available");
    }

    const employeesWithLoad = await Promise.all(
      supportEmployees.map(async (employee) => {
        const ticketCount = await ticketRepository.countByAssignedEmployee(
          employee.id
        );
        return { employee, ticketCount };
      })
    );

    employeesWithLoad.sort((a, b) => a.ticketCount - b.ticketCount);

    return employeesWithLoad[0].employee;
  },
};
