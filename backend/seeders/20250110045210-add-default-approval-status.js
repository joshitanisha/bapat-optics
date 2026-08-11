'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "approval_status",
      [
        {
          id: 1,
          name: "Pending",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 2,
          name: "Approved",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 3,
          name: "Rejected",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 4,
          name: "Under Review",
          createdAt: new Date(),
          updatedAt: new Date(),
        },

        {
          id: 5,
          name: "On Hold",
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

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete(
      "approval_status",
      {
        id: {
          [Sequelize.Op.in]: [1, 2, 3, 4, 5],
        },
      },
      {}
    );
  }
};
