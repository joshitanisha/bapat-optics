'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const productOrder = await queryInterface.describeTable("product_order_details");
    if (!productOrder.hasOwnProperty("delivery_kilometer")) {
      await queryInterface.addColumn(
        "product_order_details",
        "return_status",
        {
          type: Sequelize.BOOLEAN,
          allowNull: true,
          defaultValue:true
        }
      );
    }
  },

  async down (queryInterface, Sequelize) {
   await queryInterface.removeColumn(
      "product_order_details",
      "return_status"
    );
  }
};
