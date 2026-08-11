'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('address_types', [
      {
        id: 1,
        name: 'Home',
        status: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 2,
        name: 'Apartment',
        status: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 3,
        name: 'Work',
        status: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 4,
        name: 'Office',
        status: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 5,
        name: 'Other',
        status: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ], {
      // Add this option to ensure that the existing records are updated
      updateOnDuplicate: ["name", "updatedAt"],
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('address_types', {
      id: {
        [Sequelize.Op.in]: [1, 2, 3, 4, 5],
      },
    }, {});
  }
};
