'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
     const productOrder = await queryInterface.describeTable("users");
    if (!productOrder.hasOwnProperty("date_of_birth")) {
      await queryInterface.addColumn(
        "users",
        "date_of_birth",
        {
          type: Sequelize.DATE,
          allowNull: true,
         
        }
      );
    }
  },

  async down (queryInterface, Sequelize) {
   await queryInterface.removeColumn(
      "users",
      "date_of_birth"
    );
  }
};
