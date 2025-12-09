"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("tickets", {
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
      subject: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      status_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "ticket_status",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
      },
      customer_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "customers",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
      },
      started_employee_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "employees",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
      },
      assigned_employee_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "employees",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
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

    await queryInterface.addIndex("tickets", ["external_id"], {
      unique: true,
      name: "idx_tickets_external_id",
    });

    await queryInterface.addIndex("tickets", ["status_id"], {
      name: "idx_tickets_status_id",
    });

    await queryInterface.addIndex("tickets", ["customer_id"], {
      name: "idx_tickets_customer_id",
    });

    await queryInterface.addIndex("tickets", ["started_employee_id"], {
      name: "idx_tickets_started_employee_id",
    });

    await queryInterface.addIndex("tickets", ["assigned_employee_id"], {
      name: "idx_tickets_assigned_employee_id",
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("tickets");
  },
};
