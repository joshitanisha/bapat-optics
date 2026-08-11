'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const table = await queryInterface.describeTable("stocks");
    
    if (!table.hasOwnProperty("barcode_status")) {
      await queryInterface.addColumn("stocks", "barcode_status", {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue:0
      });
    }
      if (!table.hasOwnProperty("status")) {
      await queryInterface.addColumn("stocks", "status", {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue:1
      });
    }
  },

  async down (queryInterface, Sequelize) {
   await queryInterface.removeColumn("stocks", "barcode_status");
    await queryInterface.removeColumn("stocks", "status");
  }
};
