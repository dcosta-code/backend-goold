"use strict";
const { v4: uuidv4 } = require("uuid");

module.exports = {
  async up(queryInterface) {
    const existing = await queryInterface.sequelize.query(
      "SELECT id FROM email_signatures LIMIT 1"
    );

    if (existing[0].length === 0) {
      await queryInterface.bulkInsert("email_signatures", [
        {
          external_id: uuidv4(),
          html_content: "",
          created_at: new Date(),
          updated_at: new Date(),
        },
      ]);
    }
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("email_signatures", null, {});
  },
};
