"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("ticket_tags", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
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
      tag_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "tags",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
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

    await queryInterface.addIndex("ticket_tags", ["ticket_id", "tag_id"], {
      unique: true,
      name: "idx_ticket_tags_ticket_tag",
    });

    await queryInterface.addIndex("ticket_tags", ["ticket_id"], {
      name: "idx_ticket_tags_ticket_id",
    });

    await queryInterface.addIndex("ticket_tags", ["tag_id"], {
      name: "idx_ticket_tags_tag_id",
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("ticket_tags");
  },
};
