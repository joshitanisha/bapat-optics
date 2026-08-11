'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
   const productOrder = await queryInterface.describeTable("product_orders");
    if (!productOrder.hasOwnProperty("date_of_birth")) {
      await queryInterface.addColumn(
        "product_orders",
        "cancel_on_of_item",
        {
          type: Sequelize.INTEGER,
          allowNull: true,
         
        }
      );
    }

  
    if (!productOrder.hasOwnProperty("date_of_birth")) {
      await queryInterface.addColumn(
        "product_orders",
        "return_on_of_item",
        {
          type: Sequelize.INTEGER,
          allowNull: true,
         
        }
      );
    }
  },

  async down (queryInterface, Sequelize) {
     await queryInterface.removeColumn(
      "product_orders",
      "cancel_on_of_item"
    );
      await queryInterface.removeColumn(
      "product_orders",
      "return_on_of_item"
    );
  }
};
