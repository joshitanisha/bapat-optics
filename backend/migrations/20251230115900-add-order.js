'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
     const table = await queryInterface.describeTable("product_orders");
    
    if (!table.hasOwnProperty("gst_number")) {
      await queryInterface.addColumn("product_orders", "gst_number", {
        type: Sequelize.STRING,
        allowNull: true,
       
      });
    }
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn("product_orders", "gst_number");
  }
};
