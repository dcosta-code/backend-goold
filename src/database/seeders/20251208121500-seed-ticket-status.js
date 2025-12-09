"use strict";

const { v4: uuidv4 } = require("uuid");

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert("ticket_status", [
      {
        external_id: uuidv4(),
        name: "open",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        external_id: uuidv4(),
        name: "in_progress",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        external_id: uuidv4(),
        name: "closed",
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("ticket_status", null, {});
  },
};
