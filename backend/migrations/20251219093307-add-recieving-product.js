'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
     const table = await queryInterface.describeTable("receiving_products");
    
    if (!table.hasOwnProperty("order_no")) {
      await queryInterface.addColumn("receiving_products", "order_no", {
        type: Sequelize.STRING,
        allowNull: true,
      });
    }
  },

  async down (queryInterface, Sequelize) {
     await queryInterface.removeColumn("receiving_products", "order_no");
  }
};
