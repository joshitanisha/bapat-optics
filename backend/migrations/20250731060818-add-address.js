'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
     const appsetup = await queryInterface.describeTable("user_addresses");
    if (!appsetup.hasOwnProperty("area")) {
      await queryInterface.addColumn("user_addresses", "area", {
        type: Sequelize.STRING,
        allowNull: true,
       
      });
    }
  },

  async down (queryInterface, Sequelize) {
     await queryInterface.removeColumn("user_addresses", "area");
  }
};
