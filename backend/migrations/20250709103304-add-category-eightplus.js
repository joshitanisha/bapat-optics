'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
   const productOrder = await queryInterface.describeTable("p_categories");
    if (!productOrder.hasOwnProperty("eight_plus_status")) {
      await queryInterface.addColumn(
        "p_categories",
        "eight_plus_status",
        {
          type: Sequelize.BOOLEAN,
          allowNull: true,
          defaultValue:false
         
        }
      );
    }
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn(
      "p_categories",
      "eight_plus_status"
    );
  }
};
