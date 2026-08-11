'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
     await queryInterface.bulkInsert(
      "eye_units",
      [
        {
          id: 1,
          name: "R-SPH",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 2,
          name: "R-CYL",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 3,
          name: "R-AXIS",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 4,
          name: "R-VA",
          createdAt: new Date(),
          updatedAt: new Date(),
        },

         {
          id: 5,
          name: "L-SPH",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 6,
          name: "L-CYL",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 7,
          name: "L-AXIS",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 8,
          name: "L-VA",
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
      "eye_units",
      {
        id: {
          [Sequelize.Op.in]: [1, 2, 3, 4,5,6,7,8],
        },
      },
      {}
    );
  }
};
