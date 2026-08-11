"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const table = await queryInterface.describeTable("receivings");

    if (!table.hasOwnProperty("invoice_no")) {
      await queryInterface.addColumn("receivings", "invoice_no", {
        type: Sequelize.STRING,
        allowNull: true,
      });
    }

    if (!table.hasOwnProperty("order_no")) {
      await queryInterface.addColumn("receivings", "order_no", {
        type: Sequelize.STRING,
        allowNull: true,
      });
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("receivings", "invoice_no");
    await queryInterface.removeColumn("receivings", "order_no");
  },
};
