'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
      await queryInterface.bulkInsert(
      "prescriptions_types",
      [
        {
          id: 1,
          name: "Enter Manually",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 2,
          name: "Upload Prescription",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 3,
          name: "Not sure?",
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
      "prescriptions_types",
      {
        id: {
          [Sequelize.Op.in]: [1, 2, 3],
        },
      },
      {}
    );
  }
};
