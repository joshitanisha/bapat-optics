'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const order = await queryInterface.describeTable("products");
    if (!order.hasOwnProperty("sort_order")) {
      await queryInterface.addColumn(
        "products",
        "sort_order",
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
      "products",
      "sort_order"
    );
  }
};
