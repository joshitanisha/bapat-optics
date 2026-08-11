'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
   const Product = await queryInterface.describeTable("receiving_products");

    if (!Product.hasOwnProperty("expiry_date")) {
      await queryInterface.addColumn("receiving_products", "expiry_date", {
        type: Sequelize.STRING,
        allowNull: true,
      });
    }
  },

  async down (queryInterface, Sequelize) {
   await queryInterface.removeColumn("receiving_products", "expiry_date");
  }
};
