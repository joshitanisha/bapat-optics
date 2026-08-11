"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "offers",
      [
        {
          id: 1,
          name: "Lowest rate always",
          status: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 2,
          name: "ExEyeting offer 365 days",
          status: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 3,
          name: "Best after sale service",
          status: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 4,
          name: "Special offer for KIDS",
          status: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 5,
          name: "Senior Citizen Offer",
          status: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 6,
          name: "Special Birthday offer",
          status: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 7,
          name: "Office lens offer",
          status: true,
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
      "offers",
      {
        id: {
          [Sequelize.Op.in]: [1, 2, 3, 4, 5, 6, 7],
        },
      },
      {}
    );
  },
};
