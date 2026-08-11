"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */

    await queryInterface.bulkInsert(
      "stock_status",
      [
        {
          id: 1,
          name: "Available",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 2,
          name: "Sold",
          createdAt: new Date(),
          updatedAt: new Date(),
        },

        {
          id: 3,
          name: "Damaged",
          createdAt: new Date(),
          updatedAt: new Date(),
        },

        {
          id: 4,
          name: "Dummy",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {
        updateOnDuplicate: ["name", "updatedAt"],
      },
    );
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete(
      "stock_status",
      {
        id: {
          [Sequelize.Op.in]: [1, 2, 3],
        },
      },
      {},
    );
  },
};
