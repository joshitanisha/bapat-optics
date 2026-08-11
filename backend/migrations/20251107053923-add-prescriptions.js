"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const table = await queryInterface.describeTable("prescriptions");

    if (!table.hasOwnProperty("lense_product_id")) {
      await queryInterface.addColumn("prescriptions", "lense_product_id", {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "products",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      });
    }

    const table1 = await queryInterface.describeTable("product_order_details");

    if (!table1.hasOwnProperty("total_lense_price")) {
      await queryInterface.addColumn("product_order_details", "total_lense_price", {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
      });
    }
    const table2 = await queryInterface.describeTable("product_orders");

    if (!table2.hasOwnProperty("total_lense_price")) {
      await queryInterface.addColumn("product_orders", "total_lense_price", {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
      });
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("prescriptions", "lense_product_id");
     await queryInterface.removeColumn("product_order_details", "total_lense_price");
      await queryInterface.removeColumn("product_orders", "total_lense_price");
  },
};
