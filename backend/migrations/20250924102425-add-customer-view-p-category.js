"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const table = await queryInterface.describeTable("p_categories");
    if (!table.hasOwnProperty("customer_view")) {
      await queryInterface.addColumn("p_categories", "customer_view", {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      });
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("p_categories", "customer_view");
  },
};
