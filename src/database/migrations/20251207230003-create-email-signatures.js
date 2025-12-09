"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("email_signatures", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      external_id: {
        type: Sequelize.CHAR(36),
        allowNull: false,
        unique: true,
      },
      html_content: {
        type: Sequelize.TEXT("medium"),
        allowNull: false,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal(
          "CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"
        ),
      },
    });

    await queryInterface.addIndex("email_signatures", ["external_id"], {
      unique: true,
      name: "idx_email_signatures_external_id",
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("email_signatures");
  },
};
