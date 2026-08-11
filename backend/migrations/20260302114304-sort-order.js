"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const table = await queryInterface.describeTable("offers");

    if (!table.hasOwnProperty("sort_order")) {
      await queryInterface.addColumn("offers", "sort_order", {
        type: Sequelize.INTEGER,
        allowNull: true,
      });
    }

    const table1 = await queryInterface.describeTable("eyeqs");

    if (!table1.hasOwnProperty("sort_order")) {
      await queryInterface.addColumn("eyeqs", "sort_order", {
        type: Sequelize.INTEGER,
        allowNull: true,
      });
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("offers", "sort_order");
    await queryInterface.removeColumn("eyeqs", "sort_order");
  },
};
