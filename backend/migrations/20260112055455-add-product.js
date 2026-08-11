"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const table = await queryInterface.describeTable("products");

    if (!table.hasOwnProperty("customer_name")) {
      await queryInterface.addColumn("products", "customer_name", {
        type: Sequelize.STRING,
        allowNull: true,
      });
    }

    const table1 = await queryInterface.describeTable("product_orders");

    if (!table1.hasOwnProperty("doctor_name")) {
      await queryInterface.addColumn("product_orders", "doctor_name", {
        type: Sequelize.STRING,
        allowNull: true,
      });
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("products", "customer_name");
    await queryInterface.removeColumn("product_orders", "doctor_name");
  },
};
