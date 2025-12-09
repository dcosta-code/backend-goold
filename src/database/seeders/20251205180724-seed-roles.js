"use strict";

const { v4: uuidv4 } = require("uuid");

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert("roles", [
      {
        external_id: uuidv4(),
        name: "admin",
        description: "Administrator role with full access",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        external_id: uuidv4(),
        name: "support",
        description: "Support role with limited access",
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("roles", null, {});
  },
};
