"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("message_templates", {
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
        type: Sequelize.STRING(100),
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

    await queryInterface.addIndex("message_templates", ["external_id"], {
      unique: true,
      name: "idx_message_templates_external_id",
    });

    await queryInterface.addIndex("message_templates", ["name"], {
      unique: true,
      name: "idx_message_templates_name",
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("message_templates");
  },
};
