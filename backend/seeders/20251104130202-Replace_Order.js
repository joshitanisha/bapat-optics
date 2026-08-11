'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
   await queryInterface.bulkInsert(
      "replace_statuses",
      [
        {
          id: 1,
          name: "Requested",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 2,
          name: "Replaced",
          createdAt: new Date(),
          updatedAt: new Date(),
        },

        {
          id: 3,
          name: "Not Replaced",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
         {
          id: 4,
          name: "CN issued",
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
      "replace_statuses",
      {
        id: {
          [Sequelize.Op.in]: [1, 2, 3,4],
        },
      },
      {}
    );
  }
};
