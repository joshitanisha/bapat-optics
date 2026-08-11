'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const table1 = await queryInterface.describeTable("product_order_details");

    if (!table1.hasOwnProperty("total_discount")) {
      await queryInterface.addColumn("product_order_details", "total_discount", {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
      });
    }
     const table = await queryInterface.describeTable("product_orders");

    if (!table.hasOwnProperty("total_discount")) {
      await queryInterface.addColumn("product_orders", "total_discount", {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
      });
    }
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn("product_orders", "total_discount");
    await queryInterface.removeColumn("product_order_details", "total_discount");
  }
};
