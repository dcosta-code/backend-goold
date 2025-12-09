"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("messages", {
      id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      external_id: {
        type: Sequelize.CHAR(36),
        allowNull: false,
        unique: true,
      },
      ticket_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "tickets",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      sender_type: {
        type: Sequelize.ENUM("customer", "employee"),
        allowNull: false,
      },
      sender_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      content: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });

    await queryInterface.addIndex("messages", ["external_id"], {
      unique: true,
      name: "idx_messages_external_id",
    });

    await queryInterface.addIndex("messages", ["ticket_id"], {
      name: "idx_messages_ticket_id",
    });

    await queryInterface.addIndex("messages", ["sender_type", "sender_id"], {
      name: "idx_messages_sender",
    });

    await queryInterface.addIndex("messages", ["ticket_id", "created_at"], {
      name: "idx_messages_ticket_created",
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("messages");
  },
};
