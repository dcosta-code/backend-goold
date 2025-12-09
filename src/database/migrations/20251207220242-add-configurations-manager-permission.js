"use strict";

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert("permissions", [
      {
        key: "configurations.manager",
        description: "Manage system configurations",
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);

    const [adminRole] = await queryInterface.sequelize.query(
      "SELECT id FROM roles WHERE name = 'admin'"
    );

    const [permission] = await queryInterface.sequelize.query(
      "SELECT id FROM permissions WHERE `key` = 'configurations.manager'"
    );

    if (adminRole.length > 0 && permission.length > 0) {
      await queryInterface.bulkInsert("role_permissions", [
        {
          role_id: adminRole[0].id,
          permission_id: permission[0].id,
          created_at: new Date(),
          updated_at: new Date(),
        },
      ]);
    }
  },

  async down(queryInterface) {
    const [permission] = await queryInterface.sequelize.query(
      "SELECT id FROM permissions WHERE `key` = 'configurations.manager'"
    );

    if (permission.length > 0) {
      await queryInterface.bulkDelete("role_permissions", {
        permission_id: permission[0].id,
      });
    }

    await queryInterface.bulkDelete("permissions", {
      key: "configurations.manager",
    });
  },
};
