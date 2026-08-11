"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const table = await queryInterface.describeTable("product_orders");

    if (!table.hasOwnProperty("lens_tax")) {
      await queryInterface.addColumn("product_orders", "lens_tax", {
        type: Sequelize.STRING,
        allowNull: true,
      });
    }
    if (!table.hasOwnProperty("lens_mrp")) {
      await queryInterface.addColumn("product_orders", "lens_mrp", {
        type: Sequelize.STRING,
        allowNull: true,
      });
    }

    if (!table.hasOwnProperty("lens_discount")) {
      await queryInterface.addColumn("product_orders", "lens_discount", {
        type: Sequelize.STRING,
        allowNull: true,
      });
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("product_orders", "lens_tax");
    await queryInterface.removeColumn("product_orders", "lens_mrp");
    await queryInterface.removeColumn("product_orders", "lens_discount");
  },
};
