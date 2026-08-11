"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const table = await queryInterface.describeTable("product_orders");
    if (!table.hasOwnProperty("total_addon_price")) {
      await queryInterface.addColumn("product_orders", "total_addon_price", {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
      });
    }

    const table1 = await queryInterface.describeTable("product_order_details");
    if (!table1.hasOwnProperty("total_addon_price")) {
      await queryInterface.addColumn(
        "product_order_details",
        "total_addon_price",
        {
          type: Sequelize.DECIMAL(10, 2),
          allowNull: true,
        }
      );
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("product_orders", "total_addon_price");
    await queryInterface.removeColumn(
      "product_order_details",
      "total_addon_price"
    );
  },
};
