'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  
  async up (queryInterface, Sequelize) {
    const category = await queryInterface.describeTable("p_categories");
      if (!category.hasOwnProperty("p_categories")) {
      await queryInterface.addColumn("p_categories", "tax_percentage", {
        type: Sequelize.INTEGER,
        allowNull: true,
      });
    }
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn("p_categories", "tax_percentage");
  }
};
