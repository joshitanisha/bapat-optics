"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const table = await queryInterface.describeTable("colours");

    if (!table.hasOwnProperty("category_id")) {
      await queryInterface.addColumn("colours", "category_id", {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "p_categories",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      });
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("colours", "category_id");
  },
};
