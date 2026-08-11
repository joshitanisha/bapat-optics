'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
   try {
      await queryInterface.bulkInsert('tax_types', [
        {
          id: 1,
          name: 'GST',
          status: true,
          createdAt: Sequelize.fn('NOW'), 
          updatedAt: Sequelize.fn('NOW'),
        },
        {
          id: 2,
          name: 'SGST/CGST',
          status: true,
          createdAt: Sequelize.fn('NOW'),
          updatedAt: Sequelize.fn('NOW'),
        },

         {
          id: 3,
          name: 'IGST',
          status: true,
          createdAt: Sequelize.fn('NOW'), 
          updatedAt: Sequelize.fn('NOW'),
        },
        {
          id: 4,
          name: 'CGST',
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
      await queryInterface.bulkDelete('tax_types', {
        id: {
          [Sequelize.Op.in]: [1, 2,3,4],
        },
      }, {});
    } catch (error) {
      console.error('Error during down migration: ', error);
      throw error;
    }
  }
};
