'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      await queryInterface.bulkInsert('shift', [
        {
          name: 'Day Shift',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: 'Night Shift',
          createdAt: new Date(),
          updatedAt: new Date()
        }

      ], {});
    } catch (error) {
      console.error("Error during up migration: ", error);
      throw error;
    }
  },

  async down(queryInterface, Sequelize) {
    try {
      await queryInterface.bulkDelete('shift', {
        name: ['Day Shift', 'Night Shift']
      }, {});
    } catch (error) {
      console.error("Error during down migration: ", error);
      throw error;
    }
  }
};