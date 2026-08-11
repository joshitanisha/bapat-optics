"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const table = await queryInterface.describeTable("products");

    if (!table.hasOwnProperty("coating_id")) {
      await queryInterface.addColumn("products", "coating_id", {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "coatings",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      });
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("products", "coating_id");
  },
};
