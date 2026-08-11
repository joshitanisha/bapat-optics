'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      await queryInterface.bulkInsert('language', [
        {
          name: 'English',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: 'Hindi',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: 'Marathi',
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
      await queryInterface.bulkDelete('language', {
        name: ['English', 'Hindi', 'Marathi']
      }, {});
    } catch (error) {
      console.error("Error during down migration: ", error);
      throw error;
    }
  }
};