'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    try {
      await queryInterface.bulkInsert('delivery_types', [
        {
          id: 1,
          name: 'Door Delivery',
          status: true,
          createdAt: Sequelize.fn('NOW'), 
          updatedAt: Sequelize.fn('NOW'),
        },
        {
          id: 2,
          name: 'Lobby Delivery',
          status: true,
          createdAt: Sequelize.fn('NOW'),
          updatedAt: Sequelize.fn('NOW'),
        },
    
      ], {
        updateOnDuplicate: ["name", "updatedAt"],
      });
    } catch (error) {
      console.error('Error during up migration: ', error);
      throw error;
    }
  },

  async down (queryInterface, Sequelize) {
    try {
      await queryInterface.bulkDelete('delivery_types', {
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
