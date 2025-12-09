import { sequelize } from "../config/sequelize";
import { Customer } from "./Customer";
import { Role } from "./Role";
import { Permission } from "./Permission";
import { RolePermission } from "./RolePermission";
import { Employee } from "./Employee";
import { EmployeeRole } from "./EmployeeRole";
import { EmployeePermission } from "./EmployeePermission";
import { Configuration } from "./Configuration";
import { Tag } from "./Tag";
import { MessageTemplate } from "./MessageTemplate";
import { EmailSignature } from "./EmailSignature";
import { TicketStatus } from "./TicketStatus";
import { Ticket } from "./Ticket";
import { TicketTag } from "./TicketTag";
import { Message } from "./Message";

Role.belongsToMany(Permission, {
  through: RolePermission,
  foreignKey: "roleId",
  otherKey: "permissionId",
  as: "permissions",
});

Permission.belongsToMany(Role, {
  through: RolePermission,
  foreignKey: "permissionId",
  otherKey: "roleId",
  as: "roles",
});

Employee.belongsToMany(Role, {
  through: EmployeeRole,
  foreignKey: "employeeId",
  otherKey: "roleId",
  as: "roles",
});

Role.belongsToMany(Employee, {
  through: EmployeeRole,
  foreignKey: "roleId",
  otherKey: "employeeId",
  as: "employees",
});

Employee.belongsToMany(Permission, {
  through: EmployeePermission,
  foreignKey: "employeeId",
  otherKey: "permissionId",
  as: "permissions",
});

Permission.belongsToMany(Employee, {
  through: EmployeePermission,
  foreignKey: "permissionId",
  otherKey: "employeeId",
  as: "employees",
});

Ticket.belongsTo(TicketStatus, {
  foreignKey: "statusId",
  as: "status",
});

TicketStatus.hasMany(Ticket, {
  foreignKey: "statusId",
  as: "tickets",
});

Ticket.belongsTo(Customer, {
  foreignKey: "customerId",
  as: "customer",
});

Customer.hasMany(Ticket, {
  foreignKey: "customerId",
  as: "tickets",
});

Ticket.belongsTo(Employee, {
  foreignKey: "startedEmployeeId",
  as: "startedEmployee",
});

Ticket.belongsTo(Employee, {
  foreignKey: "assignedEmployeeId",
  as: "assignedEmployee",
});

Employee.hasMany(Ticket, {
  foreignKey: "startedEmployeeId",
  as: "startedTickets",
});

Employee.hasMany(Ticket, {
  foreignKey: "assignedEmployeeId",
  as: "assignedTickets",
});

Ticket.belongsToMany(Tag, {
  through: TicketTag,
  foreignKey: "ticketId",
  otherKey: "tagId",
  as: "tags",
});

Tag.belongsToMany(Ticket, {
  through: TicketTag,
  foreignKey: "tagId",
  otherKey: "ticketId",
  as: "tickets",
});

Ticket.hasMany(Message, {
  foreignKey: "ticketId",
  as: "messages",
});

Message.belongsTo(Ticket, {
  foreignKey: "ticketId",
  as: "ticket",
});

export {
  sequelize,
  Customer,
  Role,
  Permission,
  RolePermission,
  Employee,
  EmployeeRole,
  EmployeePermission,
  Configuration,
  Tag,
  MessageTemplate,
  EmailSignature,
  TicketStatus,
  Ticket,
  TicketTag,
  Message,
};
