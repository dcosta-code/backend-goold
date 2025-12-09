"use strict";

const { v4: uuidv4 } = require("uuid");
const argon2 = require("argon2");

module.exports = {
  async up(queryInterface) {
    const hashedPassword = await argon2.hash("Admin123");

    await queryInterface.bulkInsert("employees", [
      {
        external_id: uuidv4(),
        email: "admin@goold.com",
        password: hashedPassword,
        full_name: "System Administrator",
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);

    const [employees] = await queryInterface.sequelize.query(
      "SELECT id FROM employees WHERE email = 'admin@goold.com'"
    );

    const [roles] = await queryInterface.sequelize.query(
      "SELECT id FROM roles WHERE name = 'admin'"
    );

    if (employees.length > 0 && roles.length > 0) {
      await queryInterface.bulkInsert("employee_roles", [
        {
          employee_id: employees[0].id,
          role_id: roles[0].id,
          created_at: new Date(),
          updated_at: new Date(),
        },
      ]);
    }

    if (employees.length > 0) {
      const [permissions] = await queryInterface.sequelize.query(
        "SELECT id FROM permissions WHERE `key` IN ('support.dashboard', 'support.configurations', 'employees.manager', 'configurations.manager')"
      );

      if (permissions.length > 0) {
        const employeePermissions = permissions.map((permission) => ({
          employee_id: employees[0].id,
          permission_id: permission.id,
          created_at: new Date(),
          updated_at: new Date(),
        }));

        await queryInterface.bulkInsert(
          "employee_permissions",
          employeePermissions
        );
      }
    }
  },

  async down(queryInterface) {
    const [employees] = await queryInterface.sequelize.query(
      "SELECT id FROM employees WHERE email = 'admin@goold.com'"
    );

    if (employees.length > 0) {
      await queryInterface.bulkDelete("employee_permissions", {
        employee_id: employees[0].id,
      });
    }

    await queryInterface.bulkDelete("employee_roles", null, {});
    await queryInterface.bulkDelete("employees", { email: "admin@goold.com" });
  },
};
