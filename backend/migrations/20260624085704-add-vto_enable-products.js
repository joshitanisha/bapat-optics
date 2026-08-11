'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
  const tableDefinition = await queryInterface.describeTable('products');
  if (!tableDefinition.vtoenable) {
  await queryInterface.addColumn('products', 'vto_enable', {
      type: Sequelize.TINYINT, // or your specific data type
      defaultValue: 0,
      allowNull: true
    });
  }
  },

  async down (queryInterface, Sequelize) {
  await queryInterface.removeColumn('products', 'vto_enable');
  }
};
