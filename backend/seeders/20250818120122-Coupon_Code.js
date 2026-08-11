'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
   
    await queryInterface.bulkInsert(
      "appointment_statuses",
      [
        {
          id: 1,
          name: "Pending",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 2,
          name: "Cancelled",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 3,
          name: "Confirmed",
          createdAt: new Date(),
          updatedAt: new Date(),
        },

      ],
      {
        
        updateOnDuplicate: ["name", "updatedAt"],
      }
    );

  },

  async down (queryInterface, Sequelize) {
   await queryInterface.bulkDelete(
      "appointment_statuses",
      {
        id: {
          [Sequelize.Op.in]: [1, 2, 3],
        },
      },
      {}
    );
  }
};
