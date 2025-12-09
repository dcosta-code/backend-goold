"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("customers", {
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
      cpf: {
        type: Sequelize.STRING(11),
        allowNull: false,
        unique: true,
      },
      password: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      full_name: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      phone: {
        type: Sequelize.STRING(11),
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

    await queryInterface.addIndex("customers", ["external_id"], {
      unique: true,
      name: "idx_customers_external_id",
    });

    await queryInterface.addIndex("customers", ["cpf"], {
      unique: true,
      name: "idx_customers_cpf",
    });

    await queryInterface.addIndex("customers", ["email"], {
      name: "idx_customers_email",
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("customers");
  },
};
