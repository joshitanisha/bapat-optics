'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      await queryInterface.bulkInsert('stock_types', [
        {
          id: 1,
          name: 'Limited',
          status: true,
          createdAt: Sequelize.fn('NOW'),  // Sequelize function for current timestamp
          updatedAt: Sequelize.fn('NOW'),
        },
        {
          id: 2,
          name: 'Unlimited',
          status: true,
          createdAt: Sequelize.fn('NOW'),
          updatedAt: Sequelize.fn('NOW'),
        },
      ], {
        // Add this option to ensure that the existing records are updated
        updateOnDuplicate: ["name", "updatedAt"],
      });
    } catch (error) {
      console.error('Error during up migration: ', error);
      throw error;
    }
  },

  async down(queryInterface, Sequelize) {
    try {
      await queryInterface.bulkDelete('stock_types', {
        id: {
          [Sequelize.Op.in]: [1, 2],
        },
      }, {});
    } catch (error) {
      console.error('Error during down migration: ', error);
      throw error;
    }
  }
};
