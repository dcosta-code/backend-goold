"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("ticket_status", {
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
      name: {
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true,
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

    await queryInterface.addIndex("ticket_status", ["external_id"], {
      unique: true,
      name: "idx_ticket_status_external_id",
    });

    await queryInterface.addIndex("ticket_status", ["name"], {
      unique: true,
      name: "idx_ticket_status_name",
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("ticket_status");
  },
};
