"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const table = await queryInterface.describeTable("product_orders");
    if (!table.hasOwnProperty("reward_discount")) {
      await queryInterface.addColumn("product_orders", "reward_discount", {
        type: Sequelize.STRING,
        allowNull: true,
      });
    }
    const table1 = await queryInterface.describeTable("product_order_details");
    if (!table1.hasOwnProperty("reward_discount")) {
      await queryInterface.addColumn(
        "product_order_details",
        "reward_discount",
        {
          type: Sequelize.STRING,
          allowNull: true,
        }
      );
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn(
      "product_order_details",
      "reward_discount"
    );
     await queryInterface.removeColumn(
      "product_orders",
      "reward_discount"
    );
  },
};
