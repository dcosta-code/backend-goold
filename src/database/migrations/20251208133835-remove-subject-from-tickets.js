"use strict";

module.exports = {
  async up(queryInterface) {
    await queryInterface.removeColumn("tickets", "subject");
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.addColumn("tickets", "subject", {
      type: Sequelize.STRING(255),
      allowNull: false,
      defaultValue: "",
    });
  },
};
