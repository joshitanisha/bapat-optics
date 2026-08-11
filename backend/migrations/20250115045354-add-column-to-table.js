'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('countries', 'currency', {
      type: Sequelize.STRING,
      allowNull: false,
    });

    await queryInterface.addColumn('countries', 'country_code', {
      type: Sequelize.STRING,
      allowNull: false,
    });

    await queryInterface.addColumn('countries', 'image', {
      type: Sequelize.STRING,
      allowNull: false,
    });

    await queryInterface.addColumn('cities', 'image', {
      type: Sequelize.STRING,
      allowNull: false,
    });



  },

  async down(queryInterface, Sequelize) {
    // await queryInterface.removeColumn('products', 'item_code');

  }
};
