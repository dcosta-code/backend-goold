"use strict";

module.exports = {
  async up(queryInterface) {
    const [roles] = await queryInterface.sequelize.query(
      "SELECT id, name FROM roles"
    );
    const [permissions] = await queryInterface.sequelize.query(
      "SELECT id, `key` FROM permissions"
    );

    const adminRole = roles.find((r) => r.name === "admin");
    const supportRole = roles.find((r) => r.name === "support");

    const rolePermissions = [];

    if (adminRole) {
      permissions.forEach((p) => {
        rolePermissions.push({
          role_id: adminRole.id,
          permission_id: p.id,
          created_at: new Date(),
          updated_at: new Date(),
        });
      });
    }

    if (supportRole) {
      const supportPermissionKeys = [
        "support.dashboard",
        "support.tickets",
        "employees.read",
      ];
      permissions
        .filter((p) => supportPermissionKeys.includes(p.key))
        .forEach((p) => {
          rolePermissions.push({
            role_id: supportRole.id,
            permission_id: p.id,
            created_at: new Date(),
            updated_at: new Date(),
          });
        });
    }

    if (rolePermissions.length > 0) {
      await queryInterface.bulkInsert("role_permissions", rolePermissions);
    }
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("role_permissions", null, {});
  },
};
