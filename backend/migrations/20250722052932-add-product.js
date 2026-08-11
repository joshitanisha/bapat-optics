'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
      const product = await queryInterface.describeTable("products");
    if (!product.hasOwnProperty("popular_status")) {
      await queryInterface.addColumn("products", "popular_status", {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
       
      });
    }
  },

  async down (queryInterface, Sequelize) {
     await queryInterface.removeColumn("products", "popular_status");
  }
  
};
