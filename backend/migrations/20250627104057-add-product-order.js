'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
     const order = await queryInterface.describeTable("product_orders");
    if (!order.hasOwnProperty("appointment_details")) {
      await queryInterface.addColumn(
        "product_orders",
        "total_kilometer",
        {
          type: Sequelize.STRING,
          allowNull: true,
          defaultValue:false,
        }
      );
    }
  },

  async down (queryInterface, Sequelize) {
   await queryInterface.removeColumn(
      "product_orders",
      "total_kilometer"
    );
  }
};
