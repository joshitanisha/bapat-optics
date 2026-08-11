"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "return_status",
      [
        {
          id: 1,
          name: "Return Requested",
          createdAt: new Date(),
          updatedAt: new Date(),
        },

        {
          id: 2,
          name: "Pickup Scheduled",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 3,
          name: "Item Picked",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 4,
          name: "Returned",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 5,
          name: "Refund Process",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 6,
          name: "Refunded",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 7,
          name: "Return Rejected",
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
      "return_status",
      {
        id: {
          [Sequelize.Op.in]: [1, 2, 3, 4, 5, 6, 7, 8],
        },
      },
      {}
    );
  },
};
