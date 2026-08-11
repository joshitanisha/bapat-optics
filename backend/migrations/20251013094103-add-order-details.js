'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
     const table = await queryInterface.describeTable("product_order_details");
    if (!table.hasOwnProperty("invoice_no")) {
      await queryInterface.addColumn("product_order_details", "invoice_no", {
        type: Sequelize.STRING,
        allowNull: true,
      });
    }
  },

  async down (queryInterface, Sequelize) {
     await queryInterface.removeColumn("product_order_details", "invoice_no");
  }
};
