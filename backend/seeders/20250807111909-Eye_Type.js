'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
      await queryInterface.bulkInsert(
      "eye_types",
      [
        {
          id: 1,
          name: "RIGHT EYE(OD)",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 2,
          name: "LEFT EYE(OS)",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        
      ],
      {
        // Add this option to ensure that the existing records are updated
        updateOnDuplicate: ["name", "updatedAt"],
      }
    );
  },

  async down (queryInterface, Sequelize) {
     await queryInterface.bulkDelete(
      "eye_types",
      {
        id: {
          [Sequelize.Op.in]: [1, 2],
        },
      },
      {}
    );
  }
};
