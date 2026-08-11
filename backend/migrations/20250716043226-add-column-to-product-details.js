'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const productDetails = await queryInterface.describeTable("product_orders");
    if (!productDetails.hasOwnProperty("cancel_reason")) {
      await queryInterface.addColumn("product_orders", "cancel_reason", {
        type: Sequelize.STRING,
        allowNull: true,
      });
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("product_orders", "cancel_reason");
  }
};
