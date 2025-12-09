"use strict";

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert("permissions", [
      {
        key: "employees.manager",
        description: "Manage employees",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        key: "support.dashboard",
        description: "Access support dashboard",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        key: "support.configurations",
        description: "Manage system configurations",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        key: "configurations.manager",
        description: "Manage configurations and settings",
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("permissions", null, {});
  },
};
