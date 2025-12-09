"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("configurations", "ranking", {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
    });

    await queryInterface.addIndex("configurations", ["ranking"], {
      name: "idx_configurations_ranking",
    });
  },

  async down(queryInterface) {
    await queryInterface.removeIndex("configurations", "idx_configurations_ranking");
    await queryInterface.removeColumn("configurations", "ranking");
  },
};
