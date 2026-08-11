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
      "roles",
      [
        {
          id: 1,
          name: "Admin",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 2,
          name: "Doctor",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        // {
        //   id: 3,
        //   name: "Vendor",
        //   createdAt: new Date(),
        //   updatedAt: new Date(),
        // },
        {
          id: 4,
          name: "Customer",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 5,
          name: "Delivery Boy",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 6,
          name: "Supplier",
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
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete(
      "roles",
      {
        id: {
          [Sequelize.Op.in]: [1, 2, 3, 4, 5, 6],
        },
      },
      {}
    );
  },
};
