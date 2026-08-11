'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
     const appsetup = await queryInterface.describeTable("app_setups");
    if (!appsetup.hasOwnProperty("order_time")) {
      await queryInterface.addColumn("app_setups", "order_time", {
        type: Sequelize.INTEGER,
        allowNull: true,
       
      });
    }
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn("app_setups", "order_time");
  }
};
