'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
     const order = await queryInterface.describeTable("product_order_details");
    if (!order.hasOwnProperty("batch_no")) {
      await queryInterface.addColumn("product_order_details", "batch_no", {
        type: Sequelize.STRING,
        allowNull: true,
      });
    }
  },

  async down (queryInterface, Sequelize) {
      await queryInterface.removeColumn("product_order_details", "batch_no");
  }
};
