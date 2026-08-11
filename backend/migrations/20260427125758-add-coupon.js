'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
   const table = await queryInterface.describeTable("coupons");

    if (!table.hasOwnProperty("customer_view")) {
      await queryInterface.addColumn("coupons", "customer_view", {
        type: Sequelize.BOOLEAN,
        allowNull: true,
      });
    }
  },

  async down (queryInterface, Sequelize) {
   await queryInterface.removeColumn("coupons", "customer_view");
  }
};
