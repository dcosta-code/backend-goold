"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("configurations", {
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
      code: {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: true,
      },
      display: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      options: {
        type: Sequelize.JSON,
        allowNull: false,
      },
      selected: {
        type: Sequelize.JSON,
        allowNull: false,
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
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

    await queryInterface.addIndex("configurations", ["external_id"], {
      unique: true,
      name: "idx_configurations_external_id",
    });

    await queryInterface.addIndex("configurations", ["code"], {
      unique: true,
      name: "idx_configurations_code",
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("configurations");
  },
};
