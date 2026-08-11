'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "discount_types",
      [
        {
          id: 1,
          name: "Fixed Amount",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 2,
          name: "Percentage",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        // {
        //   id: 3,
        //   name: "Free Shipping",
        //   createdAt: new Date(),
        //   updatedAt: new Date(),
        // },
        // {
        //   id: 4,
        //   name: "Buy One Get One",
        //   createdAt: new Date(),
        //   updatedAt: new Date(),
        // },
        // {
        //   id: 5,
        //   name: "Free Gift",
        //   createdAt: new Date(),
        //   updatedAt: new Date(),
        // },
      ],
      {
        // Add this option to ensure that the existing records are updated
        updateOnDuplicate: ["name", "updatedAt"],
      }
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete(
      "discount_types",
      {
        id: {
          [Sequelize.Op.in]: [1, 2, 3, 4, 5],
        },
      },
      {}
    );
  }
};
